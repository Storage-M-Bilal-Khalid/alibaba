import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const userRole = searchParams.get('userRole');

    console.log(userId);
    console.log(userRole)

    if (!userId || !userRole) {
        return NextResponse.json(
            { success: false, message: 'Missing userId or userRole' },
            { status: 400 }
        );
    }

    let client;

    try {
        client = Database();
        console.log('Connected to PostgreSQL');

        let query = '';
        let values = [userId];
        let specificIdKey = '';

        switch (userRole) {
            case 'customer':
                query = 'SELECT customer_id FROM customers WHERE user_id = $1';
                specificIdKey = 'customer_id';
                break;

            case 'seller':
                query = 'SELECT seller_id FROM sellers WHERE user_id = $1';
                specificIdKey = 'seller_id';
                break;
            
            case 'hybrid':
                query = 'SELECT hybrid_id FROM hybrids WHERE user_id = $1';
                specificIdKey = 'hybrid_id';
                break;

            case 'admin':
                query = 'SELECT admin_id FROM admins WHERE user_id = $1';
                specificIdKey = 'admin_id';
                break;

            case 'owner':
                query = 'SELECT owner_id FROM owners WHERE user_id = $1';
                specificIdKey = 'owner_id';
                break;

            default:
                return NextResponse.json(
                    { success: false, message: 'Invalid user role' },
                    { status: 400 }
                );
        }


        const result = await client.query(query, values);

        if (result.rows.length === 0) {
            return NextResponse.json(
                { success: false, message: 'No matching record found' },
                { status: 404 }
            );
        }

        const specificId = result.rows[0][specificIdKey];

        return NextResponse.json({
            success: true,
            specificId,
        });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'Failed to fetch specific ID',
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
