import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function DELETE(req: NextRequest) {
    const client = Database();

    try {
        const body = await req.json();
        const { itemId, user, guestId } = body;

        console.log('Incoming Cart Item Deletion Request:', {
            itemId,
            user,
            guestId,
        });

        if (!itemId || (!user && !guestId)) {
            console.warn('❌ Missing required fields in request body');
            return NextResponse.json({ success: false, message: 'Missing itemId or user/guestId' }, { status: 400 });
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

        console.log(`🔍 Attempting to delete item ${itemId} for ${cartIdentifier}`);

        // SQL query to delete a single cart item
        const deleteQuery = `
            DELETE FROM cart_items
            WHERE item_id = $1
            AND cart_id = (
                SELECT cart_id FROM carts WHERE ${cartIdColumn} = $2
            )
            RETURNING item_id;
        `;

        const { rowCount } = await client.query(deleteQuery, [itemId, identifierValue]);
        
        if (rowCount === 0) {
            console.warn(`⚠️ No item found or deleted. Item: ${itemId}, User: ${cartIdentifier}`);
            return NextResponse.json({ success: false, message: 'Cart item not found or does not belong to the user' }, { status: 404 });
        }

        console.log(`✅ Successfully deleted item ${itemId}`);
        return NextResponse.json({ success: true, message: 'Cart item deleted successfully.' });

    } catch (error) {
        console.error('❌ Cart Item Deletion Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: (error as Error).message },
            { status: 500 }
        );
    }
}
