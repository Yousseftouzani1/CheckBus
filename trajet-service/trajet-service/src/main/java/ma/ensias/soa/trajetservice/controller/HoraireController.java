package ma.ensias.soa.trajetservice.controller;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.trajetservice.dto.HoraireDTO;
import ma.ensias.soa.trajetservice.service.HoraireService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/horaires")
@RequiredArgsConstructor
public class HoraireController {

    private final HoraireService horaireService;

    @GetMapping("/trajet/{trajetId}")
    public ResponseEntity<List<HoraireDTO>> getHorairesByTrajet(@PathVariable Long trajetId) {
        return ResponseEntity.ok(horaireService.getHorairesByTrajet(trajetId));
    }

    @PostMapping("/trajet/{trajetId}")
    public ResponseEntity<HoraireDTO> addHoraire(
            @PathVariable Long trajetId,
            @RequestBody HoraireDTO dto) {
        return ResponseEntity.ok(horaireService.addHoraire(trajetId, dto));
    }
}
