import { logger } from '../config/logger';

export type EventCallback = (payload: any) => void | Promise<void>;

export class EventBus {
  private static instance: EventBus;
  private readonly listeners: Map<string, EventCallback[]>;

  private constructor() {
    this.listeners = new Map();
  }

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(event: string, callback: EventCallback): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
    logger.info(`Event subscriber registered for event: ${event}`);
  }

  public unsubscribe(event: string, callback: EventCallback): void {
    const list = this.listeners.get(event);
    if (!list) return;

    this.listeners.set(
      event,
      list.filter((cb) => cb !== callback),
    );
  }

  public async publish(event: string, payload: any): Promise<void> {
    logger.info(
      `Publishing event ${event} with payload keys: [${Object.keys(payload || {}).join(', ')}]`,
    );
    const list = this.listeners.get(event);
    if (!list || list.length === 0) return;

    // Async execution of all observers
    await Promise.all(
      list.map(async (callback) => {
        try {
          await callback(payload);
        } catch (err: any) {
          logger.error(`Error in subscriber callback for event ${event}: ${err.message}`);
        }
      }),
    );
  }
}

export default EventBus;
