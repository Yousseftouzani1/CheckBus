package ma.ensias.soa.authservice.repository;

import org.springframework.stereotype.Repository;



import org.springframework.data.jpa.repository.JpaRepository;
import ma.ensias.soa.authservice.entity.UserAuth;

import java.util.Optional;

@Repository
public interface UserAuthRepository extends JpaRepository<UserAuth, Long> {

    Optional<UserAuth> findByEmail(String username); 

    Boolean existsByEmail(String email);

    UserAuth save(UserAuth userAuth);

    Optional<UserAuth> findByUsername(String username);

    
}
