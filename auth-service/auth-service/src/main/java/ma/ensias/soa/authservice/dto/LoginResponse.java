package ma.ensias.soa.authservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    
    private String token;
    private String username;
    private String email;
    private Boolean remember_me;


}
