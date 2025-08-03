import { stripe } from '@/lib/stripe/stripe';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  const requestBody = await req.json();
  const sellerId = requestBody.sellerId;
  try {
    // 1. Create Express Connect account
    const account = await stripe.accounts.create({
      type: 'express',
      capabilities: {
        card_payments: { requested: true },
        transfers: { requested: true },
      }
    });


    //refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/on-boarding?userId=${userId}`,
    // 2. Create account link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onsuccess`,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/seller/onsuccess?accountId=${account.id}&sellerId=${sellerId}`,
      type: 'account_onboarding',
    });


    // 3. Send accountLink.url to frontend
    return NextResponse.json({ url: accountLink.url });
  } catch (err) {
    console.error('Stripe Connect Error:', err);
    return NextResponse.json({ error: 'Stripe Connect error' }, { status: 500 });
  }
}


