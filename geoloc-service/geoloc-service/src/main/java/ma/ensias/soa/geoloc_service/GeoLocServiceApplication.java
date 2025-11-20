package ma.ensias.soa.geoloc_service;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class GeoLocServiceApplication {

	public static void main(String[] args) {
		SpringApplication.run(GeoLocServiceApplication.class, args);
	}

}
