package ma.ensias.soa.geoloc_service.repository;

import ma.ensias.soa.geoloc_service.entity.BusPosition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BusPositionRepository extends JpaRepository<BusPosition, Long> {

 
    List<BusPosition> findAllByBusId(Long busId);

 
    Optional<BusPosition> findTopByBusIdOrderByTimestampDesc(Long busId);
}