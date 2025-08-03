import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function PUT(req: NextRequest) {
    const client = Database();

    try {
        const body = await req.json();
        const { itemId, newQuantity, user, guestId } = body;

        console.log('Incoming Cart Update Request:', {
            itemId,
            newQuantity,
            user,
            guestId,
        });

        if (!itemId || newQuantity === undefined || (!user && !guestId)) {
            console.warn('❌ Missing required fields in request body');
            return NextResponse.json({ success: false, message: 'Missing itemId, newQuantity, or user/guestId' }, { status: 400 });
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

        console.log(`🔍 Attempting to update item ${itemId} for ${cartIdentifier}`);

        // SQL query to update the quantity of a cart item
        // A subquery is used to ensure the item belongs to the correct user's cart.
        const updateQuery = `
            UPDATE cart_items
            SET quantity = $1
            WHERE item_id = $2
            AND cart_id = (
                SELECT cart_id FROM carts WHERE ${cartIdColumn} = $3
            )
            RETURNING item_id;
        `;

        const { rowCount } = await client.query(updateQuery, [newQuantity, itemId, identifierValue]);
        
        if (rowCount === 0) {
            console.warn(`⚠️ No item found or updated. Item: ${itemId}, User: ${cartIdentifier}`);
            return NextResponse.json({ success: false, message: 'Cart item not found or does not belong to the user' }, { status: 404 });
        }

        console.log(`✅ Successfully updated item ${itemId} to quantity ${newQuantity}`);
        return NextResponse.json({ success: true, message: 'Cart item updated successfully.' });

    } catch (error) {
        console.error('❌ Cart Update Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: (error as Error).message },
            { status: 500 }
        );
    }
}
