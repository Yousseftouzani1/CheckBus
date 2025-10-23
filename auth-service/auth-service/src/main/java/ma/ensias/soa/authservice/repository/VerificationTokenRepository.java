package ma.ensias.soa.authservice.repository;

import org.springframework.stereotype.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import ma.ensias.soa.authservice.entity.VerificationToken; 

import java.util.Optional;

public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {

    
    

    Optional<VerificationToken> findByToken(String token);
    
}
