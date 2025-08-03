//Api
import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';
import { ProductGrouped, ProductRow } from '@/components/shared/Dashboard/Seller/data';

const viewProductForSellers = "SELECT p.id AS product_id, p.title, p.description, p.tierone_price,p.condition_id, p.stock, p.average_rating, p.rating_count, p.created_at, p.updated_at, pi.image_url, b.name AS brand_name, f.name AS feature_name, m.name AS manufacturer_name FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id LEFT JOIN product_brands pb ON pb.product_id = p.id LEFT JOIN brands b ON b.id = pb.brand_id LEFT JOIN product_features pf ON pf.product_id = p.id LEFT JOIN features f ON f.id = pf.feature_id LEFT JOIN product_manufacturers pm ON pm.product_id = p.id LEFT JOIN manufacturers m ON m.id = pm.manufacturer_id ORDER BY p.created_at DESC;"

const viewProductForDetailPage = "SELECT p.id AS product_id, p.title, p.description, p.tierone_price,p.condition_id, p.stock, p.average_rating, p.rating_count, p.created_at, p.updated_at, pi.image_url, b.name AS brand_name, f.name AS feature_name, m.name AS manufacturer_name FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id LEFT JOIN product_brands pb ON pb.product_id = p.id LEFT JOIN brands b ON b.id = pb.brand_id LEFT JOIN product_features pf ON pf.product_id = p.id LEFT JOIN features f ON f.id = pf.feature_id LEFT JOIN product_manufacturers pm ON pm.product_id = p.id LEFT JOIN manufacturers m ON m.id = pm.manufacturer_id where p.id = $1;"

export async function GET(req: NextRequest) {
    let queryResult;
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get('productId');
    try {
        const pool = Database();
        if (productId) {
            queryResult = await pool.query(viewProductForDetailPage,[productId]);
        }else{
            queryResult = await pool.query(viewProductForSellers);
        } 
        const productRows: ProductRow[] = queryResult.rows;
        const groupedProducts: ProductGrouped[] = [];
        const productMap = new Map<number, ProductGrouped>();
        productRows.forEach((row) => {
            if (!productMap.has(row.product_id)) {
                productMap.set(row.product_id, {
                    product_id: row.product_id,
                    title: row.title,
                    description: row.description,
                    stock:row.stock,
                    condition: row.condition_id,
                    price: row.tierone_price,
                    brand: row.brand_name,
                    feature: row.feature_name,
                    manufacturer: row.manufacturer_name,
                    images: [row.image_url],
                });
            } else {
                productMap.get(row.product_id)!.images.push(row.image_url);
            }
        });
        const result = Array.from(productMap.values());
        console.log(result)
        return NextResponse.json(
            {
                message: 'Product successfully fetch',
                result: result,
                status: 200
            }
        )
    } catch (error) {
        return NextResponse.json(
            { message: 'Internal server error', error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}