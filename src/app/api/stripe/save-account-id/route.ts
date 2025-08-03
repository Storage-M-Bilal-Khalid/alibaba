import Database from '@/lib/postgresSqlDbConnection';
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod';

const saveUserAccountIdSchema = z.object({
    sellerId: z.string(),
    accountId: z.string(),
});

export async function POST(req: NextRequest) {
    let body, client;
    try {
        client = Database();
        body = await req.json();
        const { sellerId, accountId } = saveUserAccountIdSchema.parse(body);
        console.log(sellerId);
        console.log(accountId)
        const queryText = `UPDATE sellers SET stripe_account_id = $1 WHERE seller_id = $2`;
        const result = await client.query(queryText, [accountId, sellerId]);
        console.log(result)
        if (result.rowCount !== null) {
            return NextResponse.json({ message: 'Stripe account ID updated successfully' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'No user found with the provided ID to update' }, { status: 404 });
        }
    } catch (error) {
        console.error('Update Stripe Account Error:', error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: 'Validation error' }, { status: 400 });
        }
        return NextResponse.json(
            { message: 'Internal server error', error: (error instanceof Error ? error.message : 'An unexpected error occurred') },
            { status: 500 }
        );
    }
}