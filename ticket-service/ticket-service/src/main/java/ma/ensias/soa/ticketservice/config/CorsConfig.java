package ma.ensias.soa.ticketservice.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class CorsConfig {

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        //Allowed frontend origins
        configuration.setAllowedOriginPatterns(List.of(
                "http://localhost:3000",          // React local dev
                "http://127.0.0.1:3000",          // Alternative localhost
                "https://*.yourdomain.com"        // (Optional) future production domain
        ));

        // Allowed HTTP methods
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));

        //  Allow all headers (including Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(List.of("*"));

        //  Allow credentials (cookies, authorization headers, etc.)
        configuration.setAllowCredentials(true);

        //  Cache preflight results for 1 hour
        configuration.setMaxAge(3600L);

        //  Apply configuration globally
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}

