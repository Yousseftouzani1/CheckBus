package ma.ensias.soa.trajetservice.service;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.trajetservice.dto.TrajetDTO;
import ma.ensias.soa.trajetservice.dto.TrajetEventDTO;
import ma.ensias.soa.trajetservice.entity.Trajet;
import ma.ensias.soa.trajetservice.kafka.TrajetEventProducer;
import ma.ensias.soa.trajetservice.repository.TrajetRepository;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TrajetService {

    private final TrajetRepository trajetRepository;
    private final TrajetEventProducer eventProducer;
    // Get all trajets
    public List<TrajetDTO> getAllTrajets() {
        return trajetRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Get trajet by ID
    public TrajetDTO getTrajetById(Long id) {
        Trajet trajet = trajetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trajet not found: " + id));
        return toDto(trajet);
    }

    // Search trajet by departure & arrival
    public List<TrajetDTO> searchTrajets(String depart, String arrivee) {
        return trajetRepository.findByDepartAndArrivee(depart, arrivee)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Add new trajet
    public TrajetDTO addTrajet(TrajetDTO dto) {
        Trajet trajet = toEntity(dto);
        trajetRepository.save(trajet);
        return toDto(trajet);
    }

    // Update trajet
    public TrajetDTO updateTrajet(Long id, TrajetDTO dto) {
        Trajet existing = trajetRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trajet not found: " + id));
        
        existing.setLigneCode(dto.getLigneCode());
        existing.setDepart(dto.getDepart());
        existing.setArrivee(dto.getArrivee());
        existing.setArrets(dto.getArrets());
        existing.setDistanceKm(dto.getDistanceKm());
        existing.setActive(dto.isActive());
            // Build the Kafka event
    String status = dto.isActive() ? "REACTIVATED" : "CANCELLED";
    TrajetEventDTO event = TrajetEventDTO.builder()
            .trajetId(existing.getId())
            .status(status)
            .message("Trajet " + existing.getLigneCode() + " is now " + status)
            .timestamp(new Timestamp(System.currentTimeMillis()))
            .build();
    // Publish event
    eventProducer.sendTrajetEvent(event);
        trajetRepository.save(existing);
        return toDto(existing);
    }

    // Delete trajet
    public void deleteTrajet(Long id) {
        trajetRepository.deleteById(id);
    }

    // Mappers
    private TrajetDTO toDto(Trajet entity) {
        return TrajetDTO.builder()
                .id(entity.getId())
                .ligneCode(entity.getLigneCode())
                .depart(entity.getDepart())
                .arrivee(entity.getArrivee())
                .arrets(entity.getArrets())
                .distanceKm(entity.getDistanceKm())
                .active(entity.isActive())
                .build();
    }

    private Trajet toEntity(TrajetDTO dto) {
        return Trajet.builder()
                .ligneCode(dto.getLigneCode())
                .depart(dto.getDepart())
                .arrivee(dto.getArrivee())
                .arrets(dto.getArrets())
                .distanceKm(dto.getDistanceKm())
                .active(dto.isActive())
                .build();
    }
}
