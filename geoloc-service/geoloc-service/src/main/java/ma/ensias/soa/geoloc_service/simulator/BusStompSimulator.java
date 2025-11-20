package ma.ensias.soa.geoloc_service.simulator;

import ma.ensias.soa.geoloc_service.dto.BusPositionRequestDTO;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.*;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import ma.ensias.soa.geoloc_service.enums.BusDirection;

import java.lang.reflect.Type;
import java.util.concurrent.TimeUnit;

/**
 * Simulates a bus moving smoothly between two GPS points (A ↔ B),
 * sending STOMP messages every 3 seconds.
 */
public class BusStompSimulator {

    public static void main(String[] args) throws Exception {
        long busId = 1;
        String direction = "FORWARD";
        String url = "ws://localhost:8089/geoloc/stomp/geoloc";

        WebSocketStompClient stompClient = new WebSocketStompClient(new StandardWebSocketClient());
        stompClient.setMessageConverter(new MappingJackson2MessageConverter());

        StompSessionHandler sessionHandler = new StompSessionHandlerAdapter() {
            @Override
            public void afterConnected(StompSession session, StompHeaders connectedHeaders) {
                System.out.println("✅ Connected to STOMP broker");
                session.subscribe("/topic/bus/positions", new StompFrameHandler() {
                    @Override
                    public Type getPayloadType(StompHeaders headers) {
                        return String.class;
                    }

                    @Override
                    public void handleFrame(StompHeaders headers, Object payload) {
                        System.out.println("📡 Broadcast: " + payload);
                    }
                });

                new Thread(() -> {
    try {
        // 🏙️ Define a realistic loop path inside Rabat
        double[][] rabatRoute = {
            {33.9715, -6.8498}, // Agdal
            {34.0150, -6.8326}, // Hassan
            {34.0209, -6.8350}, // Yacoub El Mansour
            {33.9425, -6.8676}, // Hay Riad
            {33.9715, -6.8498}  // back to Agdal
        };

        int steps = 100;           // number of updates between points
        boolean forward = true;    // travel direction
        long delay = 3000;         // 3 seconds between updates

        System.out.println("🚍 Starting Rabat bus simulation...");

        while (true) {
            for (int s = 0; s < rabatRoute.length - 1; s++) {
                double[] start = rabatRoute[s];
                double[] end = rabatRoute[s + 1];

                for (int i = 0; i <= steps; i++) {
                    double t = i / (double) steps;
                    if (!forward) t = 1 - t;

                    // interpolate between A and B
                    double lat = start[0] + (end[0] - start[0]) * t;
                    double lon = start[1] + (end[1] - start[1]) * t;

                    // build DTO for sending
                    BusPositionRequestDTO dto = BusPositionRequestDTO.builder()
                            .busId(busId)
                            .latitude(lat)
                            .longitude(lon)
                            .direction(forward ? BusDirection.FORWARD : BusDirection.BACKWARD)
                            .build();

                    // 🛰️ send STOMP message to backend
                    if (session != null && session.isConnected()) {
                        session.send("/app/bus/update", dto);
                        System.out.printf("🛰️ Bus %d (%s): lat=%.6f, lon=%.6f%n",
                                busId, forward ? "→" : "←", lat, lon);
                    } else {
                        System.err.println("⚠️ Session not connected, skipping update.");
                    }

                    Thread.sleep(delay);
                }
            }
            forward = !forward; // reverse direction once route completed
        }
    } catch (Exception e) {
        e.printStackTrace();
    }
}).start();

            }
        };

        stompClient.connect(url, sessionHandler).get(5, TimeUnit.SECONDS);
        System.out.println("🚍 Bus simulator started...");
        Thread.sleep(Long.MAX_VALUE);
    }
}
