package ma.ensias.soa.authservice.dto ;

import lombok.* ;


@AllArgsConstructor
@Data
public class LoginRequest {

    private String username ;
    private String password ;
    private Boolean remember_me = false ;
}