import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function POST(req: NextRequest) {
    const searchParams = req.nextUrl.searchParams;
    const customerId = searchParams.get('customerId');
    const hybridId = searchParams.get('hybridId');
    const guestId = searchParams.get('guestId');

    const body = await req.json();
    const { productId, shouldRemoveFromSaveForLater, listId } = body;

    console.log('Incoming Add to Cart Request:', {
        customerId,
        hybridId,
        guestId,
        productId,
        shouldRemoveFromSaveForLater,
        listId
    });

    if (!productId) {
        console.warn('❌ Missing productId in request body');
        return NextResponse.json({ success: false, message: 'Missing productId' }, { status: 400 });
    }

    const client = Database();

    try {
        await client.query('BEGIN'); // Start a transaction

        let cartId: number | null = null;

        // ---------------- CUSTOMER ----------------
        if (customerId) {
            console.log(`🔍 Looking for existing cart for customerId: ${customerId}`);
            const { rows } = await client.query(
                'SELECT cart_id FROM carts WHERE customer_id = $1',
                [customerId]
            );

            if (rows.length > 0) {
                cartId = rows[0].cart_id;
                console.log(`✅ Found existing cart for customer: ${cartId}`);
            } else {
                console.log('🆕 Creating new cart for customer');
                const result = await client.query(
                    'INSERT INTO carts (customer_id) VALUES ($1) RETURNING cart_id',
                    [customerId]
                );
                cartId = result.rows[0].cart_id;
                console.log(`✅ Created new customer cart: ${cartId}`);
            }
        }

        // ---------------- HYBRID ----------------
        else if (hybridId) {
            console.log(`🔍 Looking for existing cart for hybridId: ${hybridId}`);
            const { rows } = await client.query(
                'SELECT cart_id FROM carts WHERE hybrid_id = $1',
                [hybridId]
            );

            if (rows.length > 0) {
                cartId = rows[0].cart_id;
                console.log(`✅ Found existing cart for hybrid: ${cartId}`);
            } else {
                console.log('🆕 Creating new cart for hybrid');
                const result = await client.query(
                    'INSERT INTO carts (hybrid_id) VALUES ($1) RETURNING cart_id',
                    [hybridId]
                );
                cartId = result.rows[0].cart_id;
                console.log(`✅ Created new hybrid cart: ${cartId}`);
            }
        }

        // ---------------- GUEST ----------------
        else if (guestId) {
            console.log(`🔍 Looking for existing cart for guestId: ${guestId}`);
            const { rows } = await client.query(
                'SELECT cart_id FROM carts WHERE session_id = $1',
                [guestId]
            );

            if (rows.length > 0) {
                cartId = rows[0].cart_id;
                console.log(`✅ Found existing cart for guest: ${cartId}`);
            } else {
                console.log('🆕 Creating new cart for guest');
                const result = await client.query(
                    'INSERT INTO carts (session_id) VALUES ($1) RETURNING cart_id',
                    [guestId]
                );
                cartId = result.rows[0].cart_id;
                console.log(`✅ Created new guest cart: ${cartId}`);
            }
        }

        if (!cartId) {
            console.error('❌ No cart ID found or created. Aborting item insert.');
            await client.query('ROLLBACK');
            return NextResponse.json({ success: false, message: 'Cart ID not found or created' }, { status: 500 });
        }

        // ---------------- INSERT ITEM ----------------
        console.log(`🛒 Inserting product ${productId} into cart ${cartId}`);
        await client.query(
            'INSERT INTO cart_items (cart_id, product_id) VALUES ($1, $2)',
            [cartId, productId]
        );

        // ---------------- CONDITIONAL DELETION FROM SAVE FOR LATER ----------------
        if (shouldRemoveFromSaveForLater && listId) {
            console.log(`🗑️ Attempting to delete product ${productId} from 'Save for Later' list ${listId}`);
            const deleteQuery = `
                DELETE FROM save_for_later_items
                WHERE list_id = $1 AND product_id = $2;
            `;
            const { rowCount } = await client.query(deleteQuery, [listId, productId]);

            if (rowCount as number > 0) {
                console.log(`✅ Product ${productId} successfully removed from 'Save for Later' list. Rows affected: ${rowCount}`);
            } else {
                console.warn(`⚠️ Product ${productId} not found in 'Save for Later' list ${listId}. No rows were deleted.`);
            }
        } else {
            console.log('ℹ️ Skipping conditional deletion from "Save for Later". Conditions (shouldRemoveFromSaveForLater and listId) were not met.');
        }

        await client.query('COMMIT'); // Commit the transaction
        console.log('✅ Product successfully added to cart');
        return NextResponse.json({ success: true, message: 'Product added to cart' });

    } catch (error) {
        await client.query('ROLLBACK'); // Rollback on any error
        console.error('❌ Add to Cart Error:', error);
        return NextResponse.json(
            { success: false, message: 'Server error', error: (error as Error).message },
            { status: 500 }
        );
    }
}
