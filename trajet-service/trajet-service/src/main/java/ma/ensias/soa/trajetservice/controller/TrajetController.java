package ma.ensias.soa.trajetservice.controller;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.trajetservice.dto.TrajetDTO;
import ma.ensias.soa.trajetservice.service.TrajetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trajets")
@RequiredArgsConstructor
public class TrajetController {

    private final TrajetService trajetService;

    @GetMapping
    public ResponseEntity<List<TrajetDTO>> getAll() {
        return ResponseEntity.ok(trajetService.getAllTrajets());
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrajetDTO> getById(@PathVariable Long id) {
        return ResponseEntity.ok(trajetService.getTrajetById(id));
    }

    @GetMapping("/search")
    public ResponseEntity<List<TrajetDTO>> search(
            @RequestParam String depart,
            @RequestParam String arrivee) {
        return ResponseEntity.ok(trajetService.searchTrajets(depart, arrivee));
    }

    @PostMapping
    public ResponseEntity<TrajetDTO> add(@RequestBody TrajetDTO dto) {
        return ResponseEntity.ok(trajetService.addTrajet(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrajetDTO> update(@PathVariable Long id, @RequestBody TrajetDTO dto) {
        return ResponseEntity.ok(trajetService.updateTrajet(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        trajetService.deleteTrajet(id);
        return ResponseEntity.noContent().build();
    }
}
