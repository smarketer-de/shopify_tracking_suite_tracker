import DataLayerExtension from "./DataLayerExtension";
import debug from '../debug';

export default class ConsentMode extends DataLayerExtension {

  name = "ConsentMode"

  setup(): void {

    if (window.sts_config.consentMode) {
      window.dataLayer.push(['consent', 'default', {
        ad_storage: "denied",
        analytics_storage: "denied"
      }]);

      // Simulate event to update content mode to the current consent data
      this.onEvent("sts:cmp-change");
    }

  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onEvent(event: string): void {
    if (event === "sts:cmp-change" && window.sts_config.consentMode) {
      window.dataLayer.push(['consent', 'update', {
        ad_storage: window.sts_config.dataLayer.cmp.status.ads ? "granted" : "denied",
        analytics_storage: window.sts_config.dataLayer.cmp.status.analytics ? "granted" : "denied",
      }]);
      debug("Consent Mode", "Consent Mode changed");
    }
  }
}