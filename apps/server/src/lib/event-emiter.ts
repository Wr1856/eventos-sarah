import type { WebSocket } from "@fastify/websocket";

export function EventEmitter() {
  const events: Map<string, Set<WebSocket>> = new Map();

  return {
    on(event: string, socket: WebSocket) {
      if (!events.get(event)) {
        events.set(event, new Set());
      }
      events.get(event)?.add(socket);
    },

    off(event: string, socket: WebSocket) {
      if (!events.get(event)) return;

      events.get(event)?.delete(socket);

      if (events.get(event)?.size === 0) {
        events.delete(event);
      }
    },

    emit<T extends unknown[]>(event: string, ...args: T) {
      if (!events.get(event)) return;
      const listeners = events.get(event);

      if (listeners) {
        for (const listener of listeners) {
          listener.send(JSON.stringify(args));
        }
      }
    },
  };
}
