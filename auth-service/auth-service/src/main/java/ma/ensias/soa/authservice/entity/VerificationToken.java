package ma.ensias.soa.authservice.entity;

import ma.ensias.soa.authservice.Enums.TokenType;

import jakarta.persistence.*;
import lombok.*;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Getter
@Setter
@Entity
@Table(name = "verification_tokens")
public class VerificationToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String token;

    private String email;

    @Enumerated(EnumType.STRING)
    private TokenType type; 

    private LocalDateTime expiresAt;

    private boolean used = false;
    
}
