import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function POST(req: NextRequest) {
    const client = Database();

    try {
        const body = await req.json();
        const { productId, user } = body;

        console.log('Incoming Save for Later Request:', {
            productId,
            user,
        });

        // 1. Validation: Ensure all required fields are present
        if (!productId || !user || !user.role || !user.specificId) {
            console.warn('❌ Missing required fields in request body: productId, user.role, or user.specificId.');
            return NextResponse.json(
                { success: false, message: 'Missing productId or user information' },
                { status: 400 }
            );
        }

        // 2. User Identification: Determine the correct user column and value
        let listIdColumn = '';
        const identifierValue = user.specificId;

        // The prompt specifies that only 'customer' and 'hybrid' roles are allowed for saveForLater
        if (user.role === 'customer') {
            listIdColumn = 'customer_id';
        } else if (user.role === 'hybrid') {
            listIdColumn = 'hybrid_id';
        } else {
            console.warn(`❌ Invalid user role for saveForLater: ${user.role}`);
            return NextResponse.json(
                { success: false, message: 'Invalid user role' },
                { status: 400 }
            );
        }

        let listId;

        // 3. Find or create the save_for_later_lists record
        // Start a transaction to ensure both operations are atomic
        await client.query('BEGIN');
        
        try {
            // Check if a 'Save for Later' list already exists for the user
            const findListQuery = `
                SELECT list_id FROM save_for_later_lists WHERE ${listIdColumn} = $1;
            `;
            const findListResult = await client.query(findListQuery, [identifierValue]);

            if (findListResult.rows.length > 0) {
                // If a list exists, get its list_id
                listId = findListResult.rows[0].list_id;
                console.log(`🔍 Found existing 'Save for Later' list with ID: ${listId}`);
            } else {
                // If no list exists, create a new one and get the new list_id
                const createListQuery = `
                    INSERT INTO save_for_later_lists (${listIdColumn}) VALUES ($1)
                    RETURNING list_id;
                `;
                const createListResult = await client.query(createListQuery, [identifierValue]);
                listId = createListResult.rows[0].list_id;
                console.log(`✨ Created new 'Save for Later' list with ID: ${listId}`);
            }

            // 4. Insert the product into the save_for_later_items table
            // The quantity column was removed, so we only insert list_id and product_id.
            // ON CONFLICT DO NOTHING is used to prevent duplicate entries for the same product.
            const addItemQuery = `
                INSERT INTO save_for_later_items (list_id, product_id)
                VALUES ($1, $2)
                ON CONFLICT DO NOTHING;
            `;
            const addItemResult = await client.query(addItemQuery, [listId, productId]);
            
            // 5. Commit the transaction
            await client.query('COMMIT');

            console.log(`✅ Successfully added product ${productId} to 'Save for Later' list ${listId}.`);
            return NextResponse.json(
                { success: true, message: 'Product added to "Save for Later" successfully.' }
            );

        } catch (transactionError) {
            // Rollback the transaction if any part fails
            await client.query('ROLLBACK');
            throw transactionError; // Re-throw to be caught by the outer try/catch
        }

    } catch (error) {
        console.error('❌ Save for Later API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: (error as Error).message },
            { status: 500 }
        );
    }
}
