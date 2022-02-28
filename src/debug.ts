import config from './config';

// Colors for console output of different components
const LOG_COLORS: { [key: string]: string } = {
  Lib: '#C32927',
  "GTM": '#3498db',
  'BeeClever': '#1abc9c',
  "Shopify": '#831abc',
  "Ecommerce": '#b6c71a',
  'Enrichment': '#c71a85',
};

/**
 * Log a debug message if debugging is currently enabled.
 * 
 * This will only log if the `debug` flag is set to true in the config or
 * localStorage.debug_sts is set to "true".
 *
 * @param {String} prefix Name of the component logging this message
 * @param {...} args Items to log
 */
export default function debug(prefix: string, ...args: any[]): void {
  if (localStorage.debug_sts == 'true' || config('debug') === true) {
    let color = LOG_COLORS['Lib'];
    for (const key in LOG_COLORS) {
      if (prefix.includes(key)) {
        color = LOG_COLORS[key];
      }
    }

    const consoleArgs = [`%c${prefix}`, `background: ${color}; color: white; padding: 2px 3px; border-radius: 2px; font-size: 0.8em;`];
    console.log.apply(console, [...consoleArgs, ...args]);
  }
}
