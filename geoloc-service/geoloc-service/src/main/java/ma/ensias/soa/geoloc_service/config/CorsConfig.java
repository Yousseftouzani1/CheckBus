package ma.ensias.soa.geoloc_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.util.List;

/**
 * Global CORS configuration for REST and WebSocket endpoints.
 */
@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        CorsConfiguration config = new CorsConfiguration();

        // ✅ Allow frontend origins (you can restrict to your domain later)
        config.setAllowedOrigins(List.of("*"));
        
        // ✅ Allow all HTTP methods (GET, POST, PUT, DELETE, etc.)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // ✅ Allow all headers (Authorization, Content-Type, etc.)
        config.setAllowedHeaders(List.of("*"));
        
        // ✅ Allow credentials (cookies, auth headers)
        config.setAllowCredentials(true);

        // ✅ Cache CORS response for 1 hour
        config.setMaxAge(3600L);

        // Apply configuration to all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);

        return new CorsFilter(source);
    }
}
