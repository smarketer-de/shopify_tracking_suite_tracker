import DataLayerExtension from "./DataLayerExtension";

export default class EnhancedConversions extends DataLayerExtension {

  name = "EnhancedConversions"

  setup(): void {

    this.trackPurchase();

  }

  trackPurchase(): void {
    if (!window.sts_config.purchase || !window.sts_config.dataLayer.purchase) {
      return;
    }

    const { checkout } = window.Shopify;
    window.sts_enhanced_conversions = {
      "email": checkout.email,
      "phone_number": checkout.phone,
      "first_name": checkout.billing_address.first_name,
      "last_name": checkout.billing_address.last_name,
      "home_address": {
        "street": checkout.billing_address.address1,
        "city": checkout.billing_address.city,
        "region": checkout.billing_address.province,
        "postal_code": checkout.billing_address.zip,
        "country": checkout.billing_address.country
      }
    };
  }
}