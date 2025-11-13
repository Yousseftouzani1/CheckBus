package ma.ensias.soa.geoloc_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Configures WebSocket endpoints and message routing for real-time geolocation updates.
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint used by clients (buses & dashboards) to connect via WebSocket
        registry.addEndpoint("/ws/geoloc")
                .setAllowedOriginPatterns("*") // allow all origins (for now)
                .withSockJS(); // fallback for browsers that don't support WebSocket
    }

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        // Prefix for all messages coming from clients
        registry.setApplicationDestinationPrefixes("/app");

        // Prefix for messages that the server broadcasts to clients
        registry.enableSimpleBroker("/topic");
    }
}
