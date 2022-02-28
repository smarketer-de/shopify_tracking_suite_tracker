import debug from "../debug";
import { waitFor } from "../utils";
import ConsentManager, { ConsentStatus } from "./ConsentManager";

/**
 * Support for the No Consent Manager
 */
export default class None extends ConsentManager {
  name = "None"

  getUnifiedConsentState(): ConsentStatus {
    return {
      analytics: true,
      ads: true,
      ms: true,
    };
  }

  getConsentState(): any {
    return {};
  }
}