package ma.ensias.soa.geoloc_service.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        config.enableSimpleBroker("/topic"); // clients subscribe to /topic/*
        config.setApplicationDestinationPrefixes("/app"); // clients send to /app/*
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws/geoloc") // your endpoint
                .setAllowedOriginPatterns("*") // allow all origins
                .withSockJS(); // enable SockJS fallback

        registry.addEndpoint("/stomp/geoloc")
                .setAllowedOriginPatterns("*"); // allow all origins (for dev)

        
    }
}
