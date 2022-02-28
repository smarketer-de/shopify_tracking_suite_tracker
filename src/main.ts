/**
 * Smarketer Tracking Suite Tracker
 * 
 * Entry file for the tracker, this will set up all components
 */
import BeeClever from "./components/BeeClever";
import Checkout from "./components/Checkout";
import ConsentMode from "./components/ConsentMode";
import EnhancedConversions from "./components/EnhancedConversions";
import EnhancedEcommerce from "./components/EnhancedEcommerce";
import Enrichment from "./components/Enrichment";
import None from "./components/NoneCmp";
import ShopifyCMP from "./components/ShopifyCMP";
import TagManager from "./components/TagManager";
import debug from "./debug";
import Tracker from "./tracker";

(() => {
  if (window.sts) {
    debug("Loader", "STS already loaded");
    return;
  }

  if (
    document.currentScript &&
    localStorage.sts_script &&
    (document.currentScript as HTMLScriptElement).src !== localStorage.sts_script
  ) {
    // Load the script from correct source
    const script = document.createElement("script");
    script.src = localStorage.sts_script;
    document.head.appendChild(script);
    return;
  }

  window.sts = true;

  // Wait for page to finish loading
  const docReady = (fn: () => any) => {
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      setTimeout(fn, 200);
    } else {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(fn, 200);
      });
    }
  }
  docReady(() => {
    if (!window.sts_config.dataLayer) {
      window.sts_config.dataLayer = {};
    }
    if (!window.dataLayer) {
      window.dataLayer = [];
    }
    
    // Main Tracker Instance used to house all components
    const tracker = new Tracker();
    window.sts = tracker;
    
    // Add data layer extensions
    debug("Loader", "Adding data layer extensions");
    tracker.addComponent(Enrichment);
    tracker.addComponent(Checkout);
    tracker.addComponent(EnhancedEcommerce);
    tracker.addComponent(EnhancedConversions);
    
    // Add CMPs
    debug("Loader", "Adding CMPs");
    tracker.addComponent(BeeClever);
    tracker.addComponent(ShopifyCMP);
    tracker.addComponent(None);

    // Consent Mode
    debug("Loader", "Adding Consent Mode");
    tracker.addComponent(ConsentMode);

    // Add Tracking Services
    debug("Loader", "Adding tracking services");
    tracker.addComponent(TagManager);
  });
  
})();