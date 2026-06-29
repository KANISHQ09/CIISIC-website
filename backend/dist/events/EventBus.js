"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventBus = void 0;
const logger_1 = require("../config/logger");
class EventBus {
    static instance;
    listeners;
    constructor() {
        this.listeners = new Map();
    }
    static getInstance() {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus();
        }
        return EventBus.instance;
    }
    subscribe(event, callback) {
        if (!this.listeners.has(event)) {
            this.listeners.set(event, []);
        }
        this.listeners.get(event)?.push(callback);
        logger_1.logger.info(`Event subscriber registered for event: ${event}`);
    }
    unsubscribe(event, callback) {
        const list = this.listeners.get(event);
        if (!list)
            return;
        this.listeners.set(event, list.filter((cb) => cb !== callback));
    }
    async publish(event, payload) {
        logger_1.logger.info(`Publishing event ${event} with payload keys: [${Object.keys(payload || {}).join(', ')}]`);
        const list = this.listeners.get(event);
        if (!list || list.length === 0)
            return;
        // Async execution of all observers
        await Promise.all(list.map(async (callback) => {
            try {
                await callback(payload);
            }
            catch (err) {
                logger_1.logger.error(`Error in subscriber callback for event ${event}: ${err.message}`);
            }
        }));
    }
}
exports.EventBus = EventBus;
exports.default = EventBus;
