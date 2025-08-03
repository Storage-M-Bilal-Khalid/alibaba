// app/(stripe)/seller/onsuccess/page.tsx

import { Suspense } from 'react';
import StripeSuccessClient from '@/components/shared/Stripe/StripeSuccess';

export default function OnSuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <StripeSuccessClient />
    </Suspense>
  );
}