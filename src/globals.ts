import Tracker from "./tracker";
import { STSConfig } from "./types";

declare global {
  interface Window {
    sts_config: STSConfig,
    sts?: Tracker | true,
    sts_enhanced_conversions?: any,

    // Elements added by tracking services
    dataLayer: any[],

    // BeeClever CMP
    _c?: Element["insertBefore"],
    GDPR_LC_Banner?: any,

    // Shopify
    Shopify: any,
    ShopifyAnalytics: any,
  }
}
