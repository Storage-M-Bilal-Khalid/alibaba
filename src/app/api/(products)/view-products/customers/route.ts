import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';
import { ProductGrouped, ProductRow } from '@/components/shared/Dashboard/Seller/data';

interface FilterData {
    category: number;
    selectedBrands?: number[] | number;
    selectedFeatures?: number[] | number;
    selectedManufacturers?: number[] | number;
    selectedRatings?: number[];
    condition?: number | string;
    minPrice?: number;
    maxPrice?: number;
}

type ConditionOfProduct = 1 | 2 | 3 | 4

type ProductRowPOST = {
    product_id: number;
    title: string;
    description: string;
    tierone_price: number; // Changed to string to match the JSON output
    condition_id: ConditionOfProduct;
    stock: number;
    average_rating: string; // Changed to string to match the JSON output
    rating_count: number;
    created_at: string;
    updated_at: string;
    images: string[];
    brands: string[];
    features: string[];
    manufacturers: string[];
};

export async function POST(req: NextRequest) {

    try {
        const  filters : FilterData  = await req.json();
        console.log(filters)
        const pool = Database();

        const queryParams: any[] = [];
        const conditions: string[] = [];
        let queryIndex = 1;

        const baseQuery = `
            SELECT
                p.id AS product_id,
                p.title,
                p.description,
                p.tierone_price,
                p.condition_id,
                p.stock,
                p.average_rating,
                p.rating_count,
                p.created_at,
                p.updated_at,
                array_agg(pi.image_url) FILTER (WHERE pi.image_url IS NOT NULL) AS images,
                array_agg(DISTINCT b.name) FILTER (WHERE b.name IS NOT NULL) AS brands,
                array_agg(DISTINCT f.name) FILTER (WHERE f.name IS NOT NULL) AS features,
                array_agg(DISTINCT m.name) FILTER (WHERE m.name IS NOT NULL) AS manufacturers
            FROM
                products p
            LEFT JOIN
                product_images pi ON p.id = pi.product_id
            LEFT JOIN
                product_brands pb ON p.id = pb.product_id
            LEFT JOIN
                brands b ON pb.brand_id = b.id
            LEFT JOIN
                product_features pf ON p.id = pf.product_id
            LEFT JOIN
                features f ON pf.feature_id = f.id
            LEFT JOIN
                product_manufacturers pm ON p.id = pm.product_id
            LEFT JOIN
                manufacturers m ON pm.manufacturer_id = m.id
        `;

        // Start building WHERE conditions
        if (filters.category) {
            conditions.push(`p.category_id = $${queryIndex++}`);
            queryParams.push(filters.category);
        }
        
        if (filters.condition) {
            conditions.push(`p.condition_id = $${queryIndex++}`);
            queryParams.push(filters.condition);
        }

        if (filters.minPrice !== undefined && filters.maxPrice !== undefined) {
            conditions.push(`p.tierone_price BETWEEN $${queryIndex++} AND $${queryIndex++}`);
            queryParams.push(filters.minPrice, filters.maxPrice);
        }

        // if (filters.selectedRatings && filters.selectedRatings.length > 0) {
        //     const ratingConditions = filters.selectedRatings.map(() => `p.average_rating >= $${queryIndex++}`);
        //     conditions.push(`(${ratingConditions.join(' OR ')})`);
        //     filters.selectedRatings.forEach(rating => queryParams.push(rating));
        // }

        if (filters.selectedBrands && Array.isArray(filters.selectedBrands) && filters.selectedBrands.length > 0) {
            conditions.push(`p.id IN (SELECT product_id FROM product_brands WHERE brand_id = ANY($${queryIndex++}::int[]))`);
            queryParams.push(filters.selectedBrands);
        }

        if (filters.selectedFeatures && Array.isArray(filters.selectedFeatures) && filters.selectedFeatures.length > 0) {
            conditions.push(`p.id IN (SELECT product_id FROM product_features WHERE feature_id = ANY($${queryIndex++}::int[]))`);
            queryParams.push(filters.selectedFeatures);
        }

        if (filters.selectedManufacturers && Array.isArray(filters.selectedManufacturers) && filters.selectedManufacturers.length > 0) {
            conditions.push(`p.id IN (SELECT product_id FROM product_manufacturers WHERE manufacturer_id = ANY($${queryIndex++}::int[]))`);
            queryParams.push(filters.selectedManufacturers);
        }
        
        const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
        
        const finalQuery = `
            ${baseQuery}
            ${whereClause}
            GROUP BY p.id
            ORDER BY p.created_at DESC;
        `;

        console.log(finalQuery);
        console.log(queryParams)
        
        const queryResult = await pool.query(finalQuery, queryParams);
        const productRows: ProductRowPOST[] = queryResult.rows;
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
                    brand: row.brands[0],
                    feature: row.features[0],
                    manufacturer: row.manufacturers[0],
                    images: row.images,
                });
            } else {
                productMap.get(row.product_id)!.images.push(row.images[0]);
            }
        });
        const result = Array.from(productMap.values());
        console.log(result)

        return NextResponse.json(
            {
                message: 'Products successfully fetched',
                result: result,
                status: 200
            }
        );
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json(
            { message: 'Internal server error', error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}


const viewProductSearch = "SELECT p.id AS product_id, p.title, p.description, p.tierone_price,p.condition_id, p.stock, p.average_rating, p.rating_count, p.created_at, p.updated_at, pi.image_url, b.name AS brand_name, f.name AS feature_name, m.name AS manufacturer_name FROM products p LEFT JOIN product_images pi ON pi.product_id = p.id LEFT JOIN product_brands pb ON pb.product_id = p.id LEFT JOIN brands b ON b.id = pb.brand_id LEFT JOIN product_features pf ON pf.product_id = p.id LEFT JOIN features f ON f.id = pf.feature_id LEFT JOIN product_manufacturers pm ON pm.product_id = p.id LEFT JOIN manufacturers m ON m.id = pm.manufacturer_id where p.category_id = $1;"


export async function GET(req:NextRequest){
    const { searchParams } = new URL(req.url);

    const productTitle = searchParams.get('productTitle');
    const categoryId = searchParams.get('category');

    console.log('Received:', { productTitle, categoryId });
    try {
            const pool = Database();
            
            const  queryResult = await pool.query(viewProductSearch,[categoryId]);
             
            const productRows: ProductRow[] = queryResult.rows;
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