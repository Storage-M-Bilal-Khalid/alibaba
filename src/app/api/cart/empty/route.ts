import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function DELETE(req: NextRequest) {
    const client = Database();

    try {
        const body = await req.json();
        const { user, guestId } = body;

        console.log('Incoming Cart Empty Request:', {
            user,
            guestId,
        });

        if (!user && !guestId) {
            console.warn('❌ Missing required user/guest identifier in request body');
            return NextResponse.json({ success: false, message: 'Missing user/guestId' }, { status: 400 });
        }

        let cartIdentifier = '';
        let cartIdColumn = '';
        let identifierValue = null;

        // Determine the user's cart identifier based on the request body
        if (user && user.role === 'customer' && user.specificId) {
            cartIdColumn = 'customer_id';
            identifierValue = user.specificId;
            cartIdentifier = `customer_id: ${user.specificId}`;
        } else if (user && user.role === 'hybrid' && user.specificId) {
            cartIdColumn = 'hybrid_id';
            identifierValue = user.specificId;
            cartIdentifier = `hybrid_id: ${user.specificId}`;
        } else if (guestId) {
            cartIdColumn = 'session_id';
            identifierValue = guestId;
            cartIdentifier = `session_id: ${guestId}`;
        } else {
            console.warn('❌ No valid user or guest identifier found');
            return NextResponse.json({ success: false, message: 'No valid user or guest identifier found' }, { status: 400 });
        }

        console.log(`🔍 Attempting to empty cart for ${cartIdentifier}`);

        // SQL query to delete all items from a user's cart
        const deleteQuery = `
            DELETE FROM cart_items
            WHERE cart_id = (
                SELECT cart_id FROM carts WHERE ${cartIdColumn} = $1
            )
            RETURNING item_id;
        `;

        const { rowCount } = await client.query(deleteQuery, [identifierValue]);
        
        if (rowCount === 0) {
            console.log(`⚠️ Cart for ${cartIdentifier} was already empty or not found.`);
        }

        console.log(`✅ Successfully emptied cart for ${cartIdentifier}. Deleted ${rowCount} items.`);
        return NextResponse.json({ success: true, message: 'Cart emptied successfully.' });

    } catch (error) {
        console.error('❌ Cart Empty Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: (error as Error).message },
            { status: 500 }
        );
    }
}
