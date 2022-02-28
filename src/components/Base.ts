import debug from "../debug";
import Tracker from "../tracker";

/**
 * Base class for all components.
 */
export default class BaseComponent {
  /**
   * Human-readable name of the component.
   */
  public name = "Base";

  /**
   * Component Type
   * This can be "base" if no special type is chosen,
   * "ConsentManager" for all consent managers and "TrackingService"
   * for all tracking services.
   * 
   * This value is automatically set by base classes "ConsentManager"
   * and "TrackingService" so it is not necessary to set it manually.
   */
  public type = "base";

  /**
   * Parent tracker instance
   * This can be used to communicate with the main tracker instance,
   * e.g. to send events.
   */
  protected tracker: Tracker;

  /**
   * Create a new instance of the component.
   * 
   * You will most likely not need to override this method and use "setup()" instead
   * which is intended for component-specific setup.
   * 
   * @param tracker Parent tracker instance
   */
  constructor(tracker: Tracker) {
    this.tracker = tracker;
  }

  /**
   * Setup the component.
   * 
   * You should probably override this method to setup the service.
   * The parent classes setup does not need to be called as it is a noop
   * 
   * @returns void
   */
  setup(): void {
    return;
  }

  /**
   * Handler for new events.
   * This will be called by the main tracker for each new event.
   * 
   * You should obverride this method to handle events for the specific service.
   * 
   * @param name Name of the event
   * @param data Additional event data
   * @returns void
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/explicit-module-boundary-types
  onEvent(name: string, data: any): void {
    return;
  }

  /**
   * Log info message about this component
   * 
   * @param args Elements to log
   */
  private log(...args: any[]): void {
    debug(this.name, ...args);
  }
}