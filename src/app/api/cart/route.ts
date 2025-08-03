import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function GET(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const hybridId = searchParams.get('hybridId');
    const guestId = searchParams.get('guestId');

    const client = Database();

    try {
        let cartId: number | null = null;

        if (customerId) {
            const { rows } = await client.query(
                'SELECT cart_id FROM carts WHERE customer_id = $1',
                [customerId]
            );
            if (rows.length > 0) cartId = rows[0].cart_id;
        } else if (hybridId) {
            const { rows } = await client.query(
                'SELECT cart_id FROM carts WHERE hybrid_id = $1',
                [hybridId]
            );
            if (rows.length > 0) cartId = rows[0].cart_id;
        } else if (guestId) {
            const { rows } = await client.query(
                'SELECT cart_id FROM carts WHERE session_id = $1',
                [guestId]
            );
            if (rows.length > 0) cartId = rows[0].cart_id;
        } else {
            return NextResponse.json({ success: false, message: 'No valid ID provided' }, { status: 400 });
        }

        if (!cartId) {
            return NextResponse.json({ success: true, cartItems: [] }); // Empty cart
        }

        // Fetch cart items along with product details
        const { rows: cartItems } = await client.query(
            `SELECT ci.item_id,ci.cart_id, ci.product_id, ci.quantity, p.title, p.description, p.tierone_price, p.tiertwo_price, p.tierthree_price, p.stripe_product_id, p.stripe_price_id, s.stripe_account_id, u.email, u.username AS seller, pimg.image_url AS img FROM cart_items ci JOIN products p ON ci.product_id = p.id JOIN sellers s ON p.seller_id = s.seller_id JOIN users u ON s.user_id = u.user_id JOIN product_images pimg ON pimg.product_id = p.id where ci.cart_id = $1`,
            [cartId]
        );

        return NextResponse.json({ success: true, cartItems });
    } catch (error) {
        console.error('Cart Data API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Failed to fetch cart data', error: (error as Error).message },
            { status: 500 }
        );
    }
}
