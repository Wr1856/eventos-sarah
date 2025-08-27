export type NotifyMessage<T = unknown> = {
  key: string;
  message: T;
};

export function connectToEventNotification(
  eventId: string,
  onMessage: (data: NotifyMessage) => void,
) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    throw new Error("NEXT_PUBLIC_API_URL is not defined");
  }

  const url = new URL(apiUrl);
  url.protocol = url.protocol.replace("http", "ws");
  url.pathname = `/notify/${eventId}`;

  const socket = new WebSocket(url.toString());

  socket.onmessage = (event) => {
    try {
      const [data] = JSON.parse(event.data);
      onMessage(data);
    } catch (err) {
      console.error("Failed to parse notify message", err);
    }
  };

  return () => {
    socket.close();
  };
}

