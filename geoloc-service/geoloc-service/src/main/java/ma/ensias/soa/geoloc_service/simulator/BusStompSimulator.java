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
        String url = "ws://localhost:8085/geoloc/ws/geoloc";

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
                        // Starting point (Rabat)
                        double startLat = 33.9715;
                        double startLon = -6.8472;

                        // Ending point (Casablanca)
                        double endLat = 33.5731;
                        double endLon = -7.5898;

                        int steps = 100; // number of updates per trip
                        boolean forward = true;

                        while (true) {
                            for (int i = 0; i <= steps; i++) {
                                double t = i / (double) steps;
                                if (!forward) t = 1 - t;

                                // interpolate between A and B
                                double lat = startLat + (endLat - startLat) * t;
                                double lon = startLon + (endLon - startLon) * t;

                                BusPositionRequestDTO dto =
                                         BusPositionRequestDTO.builder()
                                                .busId(busId)
                                                .latitude(lat)
                                                .longitude(lon)
                                                .direction(BusDirection.FORWARD)
                                                .build();
                                         
                                         

                                session.send("/app/bus/update", dto);
                                System.out.printf("🛰️ Bus %d (%s): lat=%.6f, lon=%.6f%n",
                                        busId, forward ? "→" : "←", lat, lon);

                                Thread.sleep(3000); // send every 3 seconds
                            }
                            forward = !forward; // reverse direction
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
