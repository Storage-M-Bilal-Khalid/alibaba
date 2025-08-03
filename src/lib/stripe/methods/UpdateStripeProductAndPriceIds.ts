export interface UpdateStripeProductAndPriceIds {
  accountId: string;
  stripeProductId: string;
  oldPriceId: string;
  name?: string;
  newAmount: number;
  currency?: string;
}