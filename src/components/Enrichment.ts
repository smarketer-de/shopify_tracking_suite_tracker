import DataLayerExtension from "./DataLayerExtension";

/**
 * Enrichment component: Enrich the dataLayer with additional information
 */
export default class Enrichment extends DataLayerExtension {
  name = "Enrichment";

  setup(): void {
    if (window.ShopifyAnalytics && window.ShopifyAnalytics.meta) {
      window.sts_config.dataLayer.pageInfo = window.ShopifyAnalytics.meta;
    }
  }
}