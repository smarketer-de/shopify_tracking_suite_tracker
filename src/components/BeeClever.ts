import debug from "../debug";
import { waitFor } from "../utils";
import ConsentManager, { ConsentStatus } from "./ConsentManager";

/**
 * Support for the BeeClever Consent Manager
 */
export default class BeeClever extends ConsentManager {
  name = "BeeClever"

  setup(): void {
    if (Element.prototype.insertBefore.name !== 'insertBefore') {
      // BeeClever overrides element methods so we need to restore original ones for our scripts
      // Otherwise script will only load when the CMP is accepted
      const originalInsertBefore = Node.prototype.insertBefore;
      // @ts-ignore
      Element.prototype.insertBefore = function(newNode: Element, referenceNode) {
        // STS only lets elements through if they have the "data-sts" arguement set
        // This is to keep the original functionality intact for all other elements
        if (newNode.hasAttribute && newNode.hasAttribute("data-sts")) {
          return window._c?.apply(this, [newNode, referenceNode]);
        }
        return originalInsertBefore.call(this, newNode, referenceNode);
      };
    }

    // Override BeeClever's save method to be notified when consent is changed
    // BeeClever might not be loaded yet, so we need to wait for it to load
    waitFor(
      () => window.GDPR_LC_Banner && window.GDPR_LC_Banner.sendConsent,
    ).then(() => {
      const originalSave = window.GDPR_LC_Banner.sendConsent;
      window.GDPR_LC_Banner.sendConsent = (...args : any[]): any => {
        const returnValue = originalSave.apply(this, args);
  
        debug("BeeClever", "CMP is saving state changes");
        this.notifyConsentStateChange();
  
        return returnValue;
      };
    }).catch(() => {
      debug("BeeClever", "Info: CMP was not loaded in time so listener could not be attached");
    });
  }

  getUnifiedConsentState(): ConsentStatus {
    if (!localStorage.GDPR_legal_cookie) {
      return {
        analytics: false,
        ads: false,
        ms: false,
      }
    }
    const state = JSON.parse(localStorage.GDPR_legal_cookie);
    if (!state) {
      return {
        analytics: false,
        ads: false,
        ms: false,
      }
    }
    return {
      analytics: state._ga?.userSetting,
      ads: state._ga?.userSetting,
      ms: state._uetsid?.userSetting,
    };
  }

  getConsentState(): any {
    if (!localStorage.GDPR_legal_cookie) return {};

    const state = JSON.parse(localStorage.GDPR_legal_cookie);
    if (!state || typeof state !== "object") return {};

    // BeeClever's State has a lot of extra information not nneded for STS
    // We only need the user's setting 
    const stateExport: { [key: string]: boolean } = {};
    for (const key in state) {
      if(state[key]) {
        stateExport[key] = state[key].userSetting;
      }
    }

    debug("BeeClever", "Exporting current state:", stateExport);

    return stateExport;
  }
}