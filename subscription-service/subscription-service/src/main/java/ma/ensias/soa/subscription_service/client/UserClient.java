package ma.ensias.soa.subscription_service.client;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.subscription_service.dto.UserDTO;

@Component
@RequiredArgsConstructor
public class UserClient {

    private final RestTemplate restTemplate;

    // BASE URL ONLY — NO /api/users here
    private final String userServiceUrl = "http://user-service:8082";

    public UserDTO getUserById(Long userId) {

        // Correct final endpoint: http://user-service:8082/api/users/{id}
        String url = userServiceUrl + "/api/users/" + userId;

        ResponseEntity<UserDTO> response =
                restTemplate.getForEntity(url, UserDTO.class);

        return response.getBody();
    }
}

