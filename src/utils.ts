/**
 * Wait for a condition to be met
 * 
 * @param condition Function to check if the condition is met
 * @param timeout Timeout in ms
 * @param interval Interval in ms
 * @returns Promise that will resolve when the condition is met or reject on timeout
 */
export function waitFor(condition: () => boolean, timeout = 10000, interval = 100): Promise<void> {
  return new Promise((resolve, reject) => {
      const start = Date.now();
      const check = () => {
          if (condition()) {
              resolve();
          } else if (Date.now() - start > timeout) {
              reject();
          } else {
              setTimeout(check, interval);
          }
      };
      check();
  });
}