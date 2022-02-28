import debug from "../debug";
import ConsentManager, { ConsentStatus } from "./ConsentManager";

/**
 * Support for Shopify's built-in Consent Manager.
 * This needs to be enabled by the shop owner in the Shopify admin before it provides information.
 */
export default class ShopifyCMP extends ConsentManager {
  name = "Shopify"

  setup(): void {
    if (!window.Shopify || !window.Shopify.loadFeatures) return;
    
    window.Shopify.loadFeatures(
      [
        {
          name: 'consent-tracking-api',
          version: '0.1',
        },
      ],
      (error: Error) => {
        if (error) {
          debug("Shopify CMP", "Error while loading Consent API", error);
        } else {
          debug("Shopify CMP", "Consent API loaded");
          this.notifyConsentStateChange();
        }
      },
     );

     document.addEventListener('trackingConsentAccepted', () => {
        this.notifyConsentStateChange();
        this.tracker.triggerEvent('sts:shopify-cmp:accepted');
    });
     document.addEventListener('trackingConsentDeclined', () => {
        this.notifyConsentStateChange();
        this.tracker.triggerEvent('sts:shopify-cmp:declined');
    });
     document.addEventListener('trackingConsentReset', () => {
        this.notifyConsentStateChange();
        this.tracker.triggerEvent('sts:shopify-cmp:reset');
    });
  }

  getUnifiedConsentState(): ConsentStatus {
    const accepted = !window.Shopify.customerPrivacy.isRegulationEnforced() || window.Shopify.customerPrivacy.getTrackingConsent();
    return {
      analytics: accepted,
      ads: accepted,
      ms: accepted,
    };
  }

  getConsentState(): any {
    if (!window.Shopify || !window.Shopify.customerPrivacy) return {};

    return {
      isRegulationEnforced: window.Shopify.customerPrivacy.isRegulationEnforced(),
      regulation: window.Shopify.customerPrivacy.getRegulation(),
      trackingConsent: window.Shopify.customerPrivacy.getTrackingConsent(),
      canBeTracked: window.Shopify.customerPrivacy.userCanBeTracked(),
    }
  }
}