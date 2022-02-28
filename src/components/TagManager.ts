import config from '../config';
import debug from '../debug';
import TrackingService from './TrackingService';

/**
 * Tag Manager integration
 */
export default class TagManager extends TrackingService {
  public name = "GTM";

  setup(): void {
    // Include GTM script
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({'gtm.start': new Date().getTime(), event:'gtm.js'});
    const parentScriptTag = document.getElementsByTagName('script')[0];
    if (!parentScriptTag || !parentScriptTag.parentNode) {
      debug("GTM", "No parent script tag found");
      return;
    }
    const scriptTag = document.createElement('script');
    scriptTag.src = 'https://www.googletagmanager.com/gtm.js?id=' + config("gtmId");
    scriptTag.async = true;
    scriptTag.setAttribute('data-sts', "1");

    debug("GTM", `Loading ${config("gtmId")}`, scriptTag);

    if (window._c && window._c.name === "insertBefore") {
      debug("GTM", "Info: BeeClever is trying to block GTM - using custom insertBefore override");
    } else if (parentScriptTag.parentNode.insertBefore.name !== 'insertBefore') {
      debug("GTM", "WARN: 'insertBefore' function has been tampered with and might not correctly load GTM");
    }
    parentScriptTag.parentNode.insertBefore(scriptTag, parentScriptTag);

    // Add GTM dataLayer
    window.dataLayer.push({
      event: 'sts:start',
      ...window.sts_config.dataLayer,
    });

    if (window.sts_config.dataLayer.purchase) {
      window.dataLayer.push({
        event: 'sts:purchase',
        ...window.sts_config.dataLayer,
      });
    }
    
    debug("GTM", "Setup done");
  }

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onEvent(event: string, data: any): void {
    // Add new events to the dataLayer
    window.dataLayer.push({
      event,
      ...data,

      // Add the complete sts-internal dataLayer to keep both in sync
      ...window.sts_config.dataLayer,
    });
  }
}