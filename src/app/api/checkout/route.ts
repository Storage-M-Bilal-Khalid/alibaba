import { stripe } from '@/lib/stripe/stripe';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    const { cartItems, user: { role, specificId } } = await req.json();
    const origin = req.headers.get('origin') || new URL(req.url).origin;
    
    // Check if cartItems is empty
    if (!cartItems || cartItems.length === 0) {
        return NextResponse.json({ error: 'Cart is empty.' }, { status: 400 });
    }

    const firstItem = cartItems[0];
    const cartId = firstItem.cart_id;

    try {
        console.log(`Checkout initiated for ${cartItems.length} items.`);
        console.log(`${role} Id : ${specificId}`);
        
        // Map cart items to Stripe line items, calculating the correct price for each
        const lineItems = cartItems.map((item: any) => {
            let itemPrice: number = item.tierone_price; // Default price
            
            switch (item.quantity) {
                case 100:
                    itemPrice = item.tierone_price;
                    break;
                case 500:
                    itemPrice = item.tiertwo_price;
                    break;
                case 1500:
                    itemPrice = item.tierthree_price;
                    break;
                default:
                    console.warn(`Unexpected quantity value: ${item.quantity}. Using tier one price.`);
                    itemPrice = item.tierone_price;
            }

            return {
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.title,
                    },
                    unit_amount: Math.round(itemPrice * 100), // Stripe expects cents, rounded to avoid floating point issues
                },
                quantity: item.quantity
            };
        });

        // Map cart items to metadata, calculating the correct price for each item again
        const metadataItems = cartItems.map((item: any) => {
            let itemPrice: number = item.tierone_price; // Default price for metadata

            switch (item.quantity) {
                case 100:
                    itemPrice = item.tierone_price;
                    break;
                case 500:
                    itemPrice = item.tiertwo_price;
                    break;
                case 1500:
                    itemPrice = item.tierthree_price;
                    break;
            }

            return {
                cart_id: item.cart_id,
                product_id: item.product_id,
                userRole:role,
                stripeSellerAccountId: item.stripe_account_id,
                price: itemPrice, // Correctly assigns the price for this specific item
                quantity: item.quantity,
                cust_id: specificId
            };
        });

        const session = await stripe.checkout.sessions.create({
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/orderSuccess`,
            cancel_url: `${origin}/cancel`,
            metadata: {
                cartItems: JSON.stringify(metadataItems), // Use the newly created metadataItems array
            },
        });

        return NextResponse.json({ url: session.url }, { status: 200 });
    } catch (error: any) {
        console.error('Checkout session error:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}




            // success_url: `${origin}/orderSuccess?session_id={CHECKOUT_SESSION_ID}&cartId=${cartId}&customerId=${specificId}`,
            // cancel_url: `${origin}/cancel`,
