import Database from '@/lib/postgresSqlDbConnection';
import { stripe } from '@/lib/stripe/stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

const webhookSecret = process.env.STRIPE_WEBHOOK_API_KEY!;

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get('stripe-signature') as string;

    let event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
        console.error(`Webhook Error: ${error.message}`);
        return NextResponse.json({ error: `Webhook Error: ${error.message}` }, { status: 400 });
    }

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object as any;
        const cartItemsMetadata = session.metadata?.cartItems ? JSON.parse(session.metadata.cartItems) : [];
        const paymentIntentId = session.payment_intent;

        // Extract cartId and cust_id from the metadata of the first item
        // Assuming all items belong to the same cart and user
        const firstItem = cartItemsMetadata.length > 0 ? cartItemsMetadata[0] : null;
        if (!firstItem) {
            console.error("No cart items found in metadata.");
            return NextResponse.json({ received: false, error: 'No cart items in metadata' }, { status: 400 });
        }
        
        const cartId = firstItem.cart_id;
        const cust_id = firstItem.cust_id;
        const userRole = firstItem.userRole;

        const pool = Database();

        try {
            // Process transfers for each seller
            for (const item of cartItemsMetadata) {
                const itemPrice = item.price;
                const itemQuantity = item.quantity;
                const stripeSellerAccountId = item.stripeSellerAccountId;

                const applicationFeeAmount = Math.round(itemPrice * itemQuantity * 0.1 * 100); 
                const transferAmount = Math.round(itemPrice * itemQuantity * 0.9 * 100); 

                console.log(
                    `Processing item: Product ID ${item.product_id}, Seller ${stripeSellerAccountId}, Price ${itemPrice}, Quantity ${itemQuantity}`
                );
                console.log(`Transfer amount: ${transferAmount / 100} USD, Application fee: ${applicationFeeAmount / 100} USD`);

                console.log(`Seller Account ID for item ${item.product_id}:`, stripeSellerAccountId);
                await stripe.transfers.create({
                    amount: transferAmount,
                    currency: 'usd',
                    destination: stripeSellerAccountId,
                    transfer_group: paymentIntentId,
                });
                console.log(`Transferred ${transferAmount / 100} USD to ${stripeSellerAccountId}.`);
                console.log(`From webhook: cartId=${typeof cartId}, cust_id=${typeof cust_id}`);
            }

            
                let updateQuery = '';
                if (userRole === 'hybrid') {
                    updateQuery = `
                        UPDATE carts
                        SET payment_status = 'paid'
                        WHERE cart_id = $1 AND hybrid_id = $2;
                    `;
                } else if (userRole === 'customer') {
                    updateQuery = `
                        UPDATE carts
                        SET payment_status = 'paid'
                        WHERE cart_id = $1 AND customer_id = $2;
                    `;
                } else {
                    console.error(`❌ Unknown user role: ${userRole}`);
                    return NextResponse.json({ error: 'Unknown user role' }, { status: 400 });
                }

                const result = await pool.query(updateQuery, [cartId, cust_id]);

            if (result.rowCount === 0) {
                console.warn(`⚠️ No cart updated. CartId: ${cartId}, CustId: ${cust_id}`);
            } else {
                console.log(`✅ Successfully updated cart ${cartId} to 'paid' status.`);
            }

            return NextResponse.json({ received: true, }, { status: 200 });
        } catch (error: any) {
            console.error('Error processing payment and transfers:', error.message);
            return NextResponse.json({ error: 'Payment/Transfer Error' }, { status: 500 });
        }
    }

    return NextResponse.json({ received: true }, { status: 200 });
}


