import { stripe } from "../stripe";

export interface CreateStripeProduct {
    title: string;
    description?: string | undefined;
    tierOne_price: number;
    stripeAccountId: string;
    imageUrl: string[]
}


export async function createStripeProduct({ title, description, tierOne_price, stripeAccountId, imageUrl }: CreateStripeProduct) {
    let stripeAccount = stripeAccountId;
    const stripeProduct = await stripe.products.create(
        {
            name: title,
            description: description,
            images: imageUrl
        },
        {
            stripeAccount,
        }
    );
    const stripePrice = await stripe.prices.create(
        {
            unit_amount: tierOne_price * 100,
            currency: "usd",
            product: stripeProduct.id,
        },
        {
            stripeAccount,

        }
    );
    return { stripeProduct, stripePrice };
};