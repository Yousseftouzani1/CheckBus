package ma.ensias.soa.trajetservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.trajetservice.dto.TrajetDTO;
import ma.ensias.soa.trajetservice.service.TrajetService;
  
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
