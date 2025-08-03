import { NextRequest, NextResponse } from 'next/server';
import Database from '@/lib/postgresSqlDbConnection';

export async function GET(req: NextRequest) {
    const client = Database();

    try {
        // 1. Extract user info from query parameters
        const { searchParams } = new URL(req.url);
        const userRole = searchParams.get('userRole');
        const specificId = searchParams.get('specificId');

        console.log('Incoming Fetch Saved Product IDs Request:', {
            userRole,
            specificId,
        });

        // 2. Validation: Ensure required fields are present
        if (!userRole || !specificId) {
            console.warn('❌ Missing required query parameters: userRole or specificId.');
            return NextResponse.json(
                { success: false, message: 'Missing userRole or specificId' },
                { status: 400 }
            );
        }

        // 3. User Identification: Determine the correct user column
        let listIdColumn = '';
        const identifierValue = specificId;

        if (userRole === 'customer') {
            listIdColumn = 'customer_id';
        } else if (userRole === 'hybrid') {
            listIdColumn = 'hybrid_id';
        } else {
            console.warn(`❌ Invalid user role for saveForLater: ${userRole}`);
            return NextResponse.json(
                { success: false, message: 'Invalid user role' },
                { status: 400 }
            );
        }

        // 4. Find the user's save_for_later_list
        const findListQuery = `
            SELECT list_id FROM save_for_later_lists WHERE ${listIdColumn} = $1;
        `;
        const findListResult = await client.query(findListQuery, [identifierValue]);

        if (findListResult.rows.length === 0) {
            console.log('⚠️ No "Save for Later" list found for this user. Returning empty array.');
            return NextResponse.json({ success: true, savedForLaterProducts: [] });
        }

        const listId = findListResult.rows[0].list_id;

        // 5. Fetch all product_id's associated with the list_id
        const fetchProductIdsQuery = `
            SELECT product_id FROM save_for_later_items WHERE list_id = $1;
        `;
        const fetchProductIdsResult = await client.query(fetchProductIdsQuery, [listId]);

        // Extract just the product_id values from the rows
        const productIds = fetchProductIdsResult.rows.map(row => row.product_id);

        if (productIds.length === 0) {
            console.log('⚠️ "Save for Later" list is empty. Returning empty array.');
            return NextResponse.json({ success: true, savedForLaterProducts: [] });
        }

        console.log(productIds.length)

        // 6. Fetch full product details for the retrieved product IDs
        // This query is optimized to fetch all product details in a single call using IN clause
        const viewProductQuery = `
            SELECT 
                p.id AS product_id,
                p.title,
                p.description,
                p.tierone_price,
                p.stock,
                pi.image_url
            FROM products p
            LEFT JOIN product_images pi ON pi.product_id = p.id
            WHERE p.id IN (${productIds.map((_, i) => `$${i + 1}`).join(',')})
            ORDER BY p.id
        `;
        const productDetailsResult = await client.query(viewProductQuery, productIds);

        const savedForLaterProducts = productDetailsResult.rows;

        console.log(`✅ Successfully fetched ${savedForLaterProducts.length} full product details.`);
        console.log(savedForLaterProducts[0])
        return NextResponse.json(
            { success: true, savedForLaterProducts: savedForLaterProducts,listId:listId, status: 200 }
        );

    } catch (error) {
        console.error('❌ Fetch Saved Product IDs API Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', error: (error as Error).message },
            { status: 500 }
        );
    }
}
