import { NextRequest, NextResponse } from "next/server";
import Database from '@/lib/postgresSqlDbConnection';
import { Pool } from "pg";
import cloudinary from "@/lib/cloudinary/cloudinary";
import { createStripeProduct } from "@/lib/stripe/methods/CreateStripeProduct";

function mapConditionToId(condition: string | null): number {
    switch (condition) {
        case 'refurbished':
            return 2;
        case 'brandNew':
            return 3;
        case 'oldItem':
            return 4;
        default:
            return 3;
    }
}

export async function POST(req: NextRequest) {
    let client: Pool;
    let title, description, stock, category_id, seller_id, stripeAccountId, brands, features, manufacturers, condition_id, tierOne_price, tierTwo_price, tierThree_price, images, stripeProductId, stripePriceId, stripeResult, imageUrl: string[];
    try {
        client = Database();
        const formData = await req.formData();

        let insertQueryForProduct = "INSERT INTO products (title, description, stock, category_id,seller_id,condition_id, tierone_price, tiertwo_price, tierthree_price, created_at) VALUES ( $1, $2, $3, $4, $5, $6, $7, $8, $9, NOW() ) RETURNING id"
        const insertBrandQuery = 'INSERT INTO product_brands (product_id, brand_id) VALUES ($1, $2)';
        const insertFeatureQuery = 'INSERT INTO product_features (product_id, feature_id) VALUES ($1, $2)';
        const insertManufacturerQuery = 'INSERT INTO product_manufacturers (product_id, manufacturer_id) VALUES ($1, $2)';
        const updateStripeInfoOfProduct = `UPDATE products SET stripe_product_id = $1, stripe_price_id = $2 WHERE id = $3`;

        //Single values from form direct insert in product table
        title = formData.get('title') as string;
        description = formData.get('description') as string;
        // price = Number(formData.get('price'));
        // discount = price * 0.01;
        stock = Number(formData.get('stock'));
        category_id = Number(formData.get('category_id'));
        seller_id = Number(formData.get('seller_id'));
        stripeAccountId = formData.get('stripeAccountId') as string
        const rawCondition = formData.get('condition')?.toString() || null;
        condition_id = mapConditionToId(rawCondition);
        tierOne_price = Number(formData.get('tierOne_price')) as number;
        tierTwo_price = Number(formData.get('tierTwo_price')) as number;
        tierThree_price = Number(formData.get('tierThree_price')) as number;
        //Multivalued from form insert after inserting product in product table
        brands = formData.getAll('brands') as string[];
        features = formData.getAll('features') as string[];
        manufacturers = formData.getAll('manufactures') as string[];
        images = formData.getAll('images') as File[];


        const values = [
            title, description, stock, category_id, seller_id, condition_id, tierOne_price, tierTwo_price, tierThree_price
        ];

        const result = await client.query(insertQueryForProduct, values);
        const newProductId = result.rows[0].id;

        try {
            await client.query('BEGIN');

            // Log for successful product creation
            console.log(`✅ Product created with ID: ${newProductId}`);

            console.log(brands)

            await Promise.all(
                brands.map((brandId) =>
                    client.query(insertBrandQuery, [newProductId, Number(brandId)])
                )
            );
            console.log(`✅ Brands linked for product ${newProductId}`);

            console.log(features)

            await Promise.all(
                features.map((featureId) =>
                    client.query(insertFeatureQuery, [newProductId, Number(featureId)])
                )
            );
            console.log(`✅ Features linked for product ${newProductId}`);

            console.log(manufacturers)
            await Promise.all(
                manufacturers.map((manufacturerId) => {
                    
                    client.query(insertManufacturerQuery, [newProductId, Number(manufacturerId)])
                }
                )
            );

            console.log(`✅ Manufacturers linked for product ${newProductId}`);

            const uploads = await Promise.all(
                images.map(async (image) => {
                    const arrayBuffer = await image.arrayBuffer();
                    const buffer = Buffer.from(arrayBuffer);

                    return new Promise<{ url: string; public_id: string }>((resolve, reject) => {
                        const stream = cloudinary.uploader.upload_stream(
                            { folder: 'products' },
                            async (error, result) => {
                                if (error || !result) {
                                    return reject(error || new Error("Cloudinary upload failed"));
                                }

                                const url = result.secure_url;
                                const public_id = result.public_id;
                                const uploaded_at = new Date();

                                try {
                                    await client.query(
                                        'INSERT INTO product_images (product_id, image_url, uploaded_at, public_id) VALUES ($1, $2, $3, $4)',
                                        [newProductId, url, uploaded_at, public_id]
                                    );

                                    console.log('🖼️ Uploaded Image:', public_id);
                                    resolve({ url, public_id });
                                } catch (dbError) {
                                    console.error('❌ Failed to save image URL to database:', dbError);
                                    reject(new Error(`Failed to save image URL for public_id ${public_id}`));
                                }
                            }
                        );

                        const { Readable } = require('stream');
                        const readable = new Readable();
                        readable.push(buffer);
                        readable.push(null);
                        readable.pipe(stream);
                    });
                })
            );

            imageUrl = uploads.map(upload => upload.url);
            console.log(`✅ All images uploaded and saved to DB.`);

            // Log inputs for Stripe to aid debugging
            console.log('Sending to Stripe:', { title, description, tierOne_price, stripeAccountId, imageUrl });
            const stripeResult = await createStripeProduct({ title, description, tierOne_price, stripeAccountId, imageUrl });

            const stripeProductId = stripeResult.stripeProduct.id;
            const stripePriceId = stripeResult.stripePrice.id;
            console.log(`✅ Stripe product created with ID: ${stripeProductId} and price ID: ${stripePriceId}`);

            await client.query(updateStripeInfoOfProduct, [stripeProductId, stripePriceId, newProductId]);
            console.log(`✅ Product ID ${newProductId} updated with Stripe IDs.`);

            await client.query('COMMIT');
            console.log('✨ Transaction committed successfully.');

            return NextResponse.json({
                message: `Product created and Stripe integration successful. Product ID: ${newProductId}`
            }, { status: 200 });

        } catch (error) {
            await client.query('ROLLBACK');

            // Generic fallback for any other uncaught error
            return NextResponse.json(
                { message: `Error creating product: ${'An unknown error occurred'}` },
                { status: 400 }
            );
        }
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}

