package ma.ensias.soa.geoloc_service.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.geoloc_service.dto.BusPositionRequestDTO;
import ma.ensias.soa.geoloc_service.dto.BusPositionResponseDTO;
import ma.ensias.soa.geoloc_service.service.BusPositionService;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST API for querying and managing bus positions.
 */
@RestController
@RequestMapping("/api/geo")
@RequiredArgsConstructor
@Slf4j
@Validated
public class BusPositionController {

    private final BusPositionService positionService;

    /**
     * POST /api/geo/update
     * Receive a bus position update (alternative to WebSocket)
     */
    @PostMapping("/update")
    public ResponseEntity<BusPositionResponseDTO> updateBusPosition(
            @RequestBody @Validated BusPositionRequestDTO request) {
        log.info("Received HTTP position update for bus {}", request.getBusId());
        BusPositionResponseDTO response = positionService.saveOrUpdatePosition(request);
        return ResponseEntity.ok(response);
    }

    /**
     * GET /api/geo/{busId}
     * Get the latest position for a specific bus
     */
    @GetMapping("/{busId}")
    public ResponseEntity<BusPositionResponseDTO> getLatestBusPosition(@PathVariable Long busId) {
        Optional<BusPositionResponseDTO> response = positionService.getLatestPosition(busId);
        return response.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * GET /api/geo/bus/{busId}/all
     * Get all historical positions for a specific bus
     */
    @GetMapping("/bus/{busId}/all")
    public ResponseEntity<List<BusPositionResponseDTO>> getAllPositionsForBus(@PathVariable Long busId) {
        List<BusPositionResponseDTO> positions = positionService.getAllPositionsForBus(busId);
        return ResponseEntity.ok(positions);
    }

    /**
     * GET /api/geo/all
     * Get all latest recorded bus positions (for dashboard)
     */
    @GetMapping("/all")
    public ResponseEntity<List<BusPositionResponseDTO>> getAllPositions() {
        List<BusPositionResponseDTO> positions = positionService.getAllPositions();
        return ResponseEntity.ok(positions);
    }
}
