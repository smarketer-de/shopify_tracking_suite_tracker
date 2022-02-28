export type CheckoutV1 = {
  first_time_accessed: boolean;
  customer: 'newcustomer' | 'repeatcustomer';
}

/**
 * Config for the tracker as provided by the Snippet injected
 * to the Shopify template
 */
export type STSConfig = {
  gtmId: string;
  consentMode: boolean;
  cmp: string;
  dataLayer: { [key: string]: any };
  debug?: boolean;
  purchase?: CheckoutV1;
}