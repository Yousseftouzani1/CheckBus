import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

// ✅ Updated URL
// Use the same path as defined in your backend WebSocketConfig:
// registry.addEndpoint("/ws/geoloc").setAllowedOriginPatterns("*").withSockJS();
const SOCKET_URL = "http://localhost:8089/geoloc/ws/geoloc";

let stompClient = null;

export function connect(onMessageReceived) {
  const socket = new SockJS(SOCKET_URL); // SockJS handles CORS + protocol fallback

  stompClient = new Client({
    webSocketFactory: () => socket,
    reconnectDelay: 5000, // Auto-reconnect after 5s
    onConnect: () => {
      console.log("✅ Connected to STOMP broker on /ws/geoloc");
      stompClient.subscribe("/topic/bus/positions", (message) => {
        if (message.body) {
          const busUpdate = JSON.parse(message.body);
          console.log("📩 Received bus update:", busUpdate);
          onMessageReceived(busUpdate);
        }
      });
    },
    onStompError: (frame) => {
      console.error("❌ STOMP error:", frame.headers["message"]);
      console.error("Details:", frame.body);
    },
  });

  stompClient.activate();
}

export function disconnect() {
  if (stompClient) stompClient.deactivate();
}
