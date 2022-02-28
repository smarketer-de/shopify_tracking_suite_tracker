import { STSConfig } from './types';

/**
 * Get or set a configuration value on the global "window.sts_config" object.
 * 
 * If no value argument is provided or it is undefined, the current value is returned.
 * If a value argument is provided and it is not undefined, the key is set to the new value.
 * 
 * Example:
 * config("test") -> undefined
 * config("test", "value") -> "value"
 * config("test") -> "value"
 * 
 * @param key Key to set or get
 * @param value Optional value to set to
 * @returns Value
 */
const config = <K extends keyof STSConfig>(key: K, value: any | undefined = undefined): STSConfig[K] => {
  if (value !== undefined) {
    window.sts_config = window.sts_config || {};
    window.sts_config[key] = value;
  }

  return window.sts_config && window.sts_config[key];
};

export default config;
