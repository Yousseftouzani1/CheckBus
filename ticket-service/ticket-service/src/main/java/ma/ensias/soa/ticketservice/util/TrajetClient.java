package ma.ensias.soa.ticketservice.util;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import ma.ensias.soa.ticketservice.dto.TrajetDTO;

@Component
public class TrajetClient {

    private final RestTemplate restTemplate = new RestTemplate();

    private final String BASE_URL = "http://trajet-service:8083/api/trajets"; 
    // adapt port to the one in docker-compose or service registry

    public TrajetDTO getTrajetById(Long trajetId) {
        return restTemplate.getForObject(BASE_URL + "/" + trajetId, TrajetDTO.class);
    }
}
