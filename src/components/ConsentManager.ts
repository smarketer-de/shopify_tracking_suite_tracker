import BaseComponent from "./Base";

export type ConsentStatus = {
  analytics: boolean,
  ads: boolean,
  ms: boolean,
}

/**
 * Parent class for all consent manager
 */
export default class ConsentManager extends BaseComponent {
  public type = "ConsentManager";
  protected consentStateChangeCallbacks: ((status: ConsentStatus) => void)[] = [];

  /**
   * Return the current state of the consent manager's consent
   * 
   * @returns Status information
   */
  getConsentState(): any {
    return {};
  }

  /**
   * Register a new callback that should be called when the consent state changes
   * 
   * @param callback Callback to call
   */
  onConsentStateChange(callback: (status: ConsentStatus) => void): void {
    this.consentStateChangeCallbacks.push(callback);
  }

  /**
   * Notify all consent state change callbacks about a consent state change
   * Internal function that can be used by subclasses
   */
  protected notifyConsentStateChange(): void {
    this.consentStateChangeCallbacks.forEach(callback => callback(this.getUnifiedConsentState()));
  }

  /**
   * Retuns a unified structure to be used in the data layer
   * 
   * @returns Status
   */
  getUnifiedConsentState(): ConsentStatus {
    return {
      analytics: true,
      ads: true,
      ms: true,
    }
  }
}