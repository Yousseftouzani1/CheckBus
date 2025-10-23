package ma.ensias.soa.authservice.dto ;

import lombok.* ;


@AllArgsConstructor
@Data
public class RegisterRequest {
    private String username ;
    private String password ;
    private String email ;
}
