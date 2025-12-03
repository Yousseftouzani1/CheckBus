package ma.ensias.soa.notification_service.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow credentials
        config.setAllowCredentials(true);
        
        // Allow ALL origins
        config.addAllowedOriginPattern("*");
        
        // Allow ALL headers
        config.addAllowedHeader("*");
        
        // Allow ALL methods (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");
        
        // Expose all headers
        config.addExposedHeader("*");
        
        // Apply to all endpoints
        source.registerCorsConfiguration("/**", config);
        
        return new CorsFilter(source);
    }
}