import DataLayerExtension from "./DataLayerExtension";

export default class EnhancedEcommerce extends DataLayerExtension {

  name = "EnhancedEcommerce"

  setup(): void {

    this.trackAddToCart();
    this.trackPurchase();

  }

  trackPurchase(): void {
    if (!window.sts_config.purchase || !window.sts_config.dataLayer.purchase) {
      return;
    }

    window.sts_config.dataLayer.ecommerce = {
      purchase: {
        actionField: {
          id: window.sts_config.dataLayer.purchase.orderNumber,
          affiliation: "Online Store",
          revenue: window.sts_config.dataLayer.purchase.value,
          tax: window.sts_config.dataLayer.purchase.tax,
          shipping: window.sts_config.dataLayer.purchase.shipping,
          coupon: window.sts_config.dataLayer.purchase.discount
        },
        products: window.sts_config.dataLayer.purchase.items.map((item: {[key: string]: any}) => {
          return {
            id: item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            variant: item.variant_id,
            brand: item.brand,
          };
        })
      }
    }
  }

  trackAddToCart(): void {
    let cooldownTimer: NodeJS.Timeout | null = null;

    const buttons = document.querySelectorAll(`
      [id^="add-to-cart"],
      [id^="add"],
      [id^="AddToCart"],
      [id^="product-add"],
      [id^="AddToCartText"],
      [class^=".add"],
      [class^=".shg-box-content"],
      [class^="action_button add_to_cart"],
      [data-action="add-to-cart"],
      [class^="ProductForm__AddToCart"]
    `.replace(/[\n ]/g, ''));
    buttons.forEach(button => {
      button.addEventListener("click", () => {
        // Cooldown timer used to prevent multiple events from being sent
        if (cooldownTimer) return;
        cooldownTimer = setTimeout(() => {
          cooldownTimer = null;
        }, 100);

        if (window.sts_config.dataLayer.pageInfo.product) {
          window.sts_config.dataLayer.ecommerce = window.sts_config.dataLayer.ecommerce || {};
          window.sts_config.dataLayer.ecommerce.add = {
            actionField: {
              items: [{
                id: window.sts_config.dataLayer.pageInfo.product.id,
                name: window.sts_config.dataLayer.pageInfo.product.name,
                price: window.sts_config.dataLayer.pageInfo.product.price,
              }]
            }
          }
        }

        this.tracker.triggerEvent('addToCart');
      });
    });
  }

}