import BaseComponent from "./components/Base";
import ConsentManager from "./components/ConsentManager";
import debug from "./debug";

/**
 * Tracker class
 * This class orchestrates all other tracker components (services and CMPs)
 */
export default class Tracker {
  /**
   * Currenctly active components
   */
  components: BaseComponent[] = [];

  constructor() {
    debug("STS Lib", "Instance created");
  }

  /**
   * Instantiate and add a new component to the tracker
   * This requires the class contructor, not an instance!
   * 
   * @param component Component to add
   */
  addComponent(component: new (tracker: Tracker) => BaseComponent): void {
    const componentInstance = new component(this)
    this.components.push(componentInstance);
    debug("STS Lib", `Added component ${componentInstance.name}`);

    componentInstance.setup();

    if (componentInstance.type === "ConsentManager") {
      // Handle connecting the Consent Manager to tracking services
      debug("STS Lib", `Registring component ${componentInstance.name} as CMP`);

      const cmp = componentInstance as ConsentManager;
      
      // Add current consent state to data layer
      window.sts_config.dataLayer.cmp = window.sts_config.dataLayer.cmp || {};
      window.sts_config.dataLayer.cmp[cmp.name] = cmp.getConsentState();
      debug("STS Lib", "Added CMP state to dataLayer", window.sts_config.dataLayer.cmp);
      if (cmp.name === window.sts_config.cmp) {
        debug("STS Lib", "Using CMP as active CMP", cmp.name);
        window.sts_config.dataLayer.cmp.status = cmp.getUnifiedConsentState();
      }

      // Listen for consent changes
      cmp.onConsentStateChange((status) => {
        debug("STS Lib", `CMP ${componentInstance.name} had a consent state change`);
        window.sts_config.dataLayer.cmp[cmp.name] = cmp.getConsentState();
        
        if (cmp.name === window.sts_config.cmp) {
          window.sts_config.dataLayer.cmp.status = status;
          this.triggerEvent("sts:cmp-change", {
            updatedCmp: cmp.name,
          });
        }
      });
    }
  }

  /**
   * Trigger a new event for all components.
   * 
   * This method might be called from outside the tracker
   * to add a new event to the data layer of all services.
   * 
   * @param name Name of the event
   * @param data Additional data to be passed to the event
   */
  triggerEvent(name: string, data: Object = {}): void {
    this.components.forEach(component => {
      component.onEvent(name, data);
    });
  }
}