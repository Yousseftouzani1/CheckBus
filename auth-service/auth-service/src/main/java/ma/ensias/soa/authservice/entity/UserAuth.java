package ma.ensias.soa.authservice.entity;

import ma.ensias.soa.authservice.Enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;



@Entity
@Table(name = "users_auth")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Setter
@Getter
@Builder
public class UserAuth {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String username;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false, unique = true)
    private String email;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role = Role.USER;

    @Column(name = "isActive")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", nullable = true, updatable = false)
    private Instant created_at ; 
    
}
