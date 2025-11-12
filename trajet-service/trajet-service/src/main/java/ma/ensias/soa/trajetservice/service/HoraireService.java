package ma.ensias.soa.trajetservice.service;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.trajetservice.dto.HoraireDTO;
import ma.ensias.soa.trajetservice.entity.Horaire;
import ma.ensias.soa.trajetservice.entity.Trajet;
import ma.ensias.soa.trajetservice.repository.HoraireRepository;
import ma.ensias.soa.trajetservice.repository.TrajetRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class HoraireService {

    private final HoraireRepository horaireRepository;
    private final TrajetRepository trajetRepository;

    public List<HoraireDTO> getHorairesByTrajet(Long trajetId) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet not found: " + trajetId));
        return horaireRepository.findByTrajet(trajet)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public HoraireDTO addHoraire(Long trajetId, HoraireDTO dto) {
        Trajet trajet = trajetRepository.findById(trajetId)
                .orElseThrow(() -> new RuntimeException("Trajet not found: " + trajetId));

        Horaire horaire = Horaire.builder()
                .trajet(trajet)
                .heureDepart(dto.getHeureDepart())
                .heureArrivee(dto.getHeureArrivee())
                .jour(dto.getJour())
                .build();

        horaireRepository.save(horaire);
        return toDto(horaire);
    }

    private HoraireDTO toDto(Horaire horaire) {
        return HoraireDTO.builder()
                .id(horaire.getId())
                .trajetId(horaire.getTrajet().getId())
                .heureDepart(horaire.getHeureDepart())
                .heureArrivee(horaire.getHeureArrivee())
                .jour(horaire.getJour())
                .build();
    }
}
