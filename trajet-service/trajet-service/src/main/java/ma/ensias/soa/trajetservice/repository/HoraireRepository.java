package ma.ensias.soa.trajetservice.repository;

import ma.ensias.soa.trajetservice.entity.Horaire;
import ma.ensias.soa.trajetservice.entity.Trajet;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoraireRepository extends JpaRepository<Horaire, Long> {
    List<Horaire> findByTrajet(Trajet trajet);
    List<Horaire> findByJour(String jour);
}
