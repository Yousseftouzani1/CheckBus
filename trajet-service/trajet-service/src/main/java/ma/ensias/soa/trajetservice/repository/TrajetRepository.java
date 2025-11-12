package ma.ensias.soa.trajetservice.repository;


import ma.ensias.soa.trajetservice.entity.Trajet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TrajetRepository extends JpaRepository<Trajet, Long> {
    List<Trajet> findByDepartAndArrivee(String depart, String arrivee);
    List<Trajet> findByActiveTrue();
}

