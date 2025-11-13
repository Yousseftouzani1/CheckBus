package ma.ensias.soa.geoloc_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.geoloc_service.dto.BusPositionRequestDTO;
import ma.ensias.soa.geoloc_service.dto.BusPositionResponseDTO;
import ma.ensias.soa.geoloc_service.entity.BusPosition;
import ma.ensias.soa.geoloc_service.enums.BusDirection;
import ma.ensias.soa.geoloc_service.kafka.BusPositionEventProducer;
import ma.ensias.soa.geoloc_service.repository.BusPositionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Handles business logic for geolocation updates, caching, and retrieval.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class BusPositionService {

    private final BusPositionRepository repository;
    private final RedisPositionService redisService;
    private final BusPositionEventProducer busPositionEventProducer;


    /**
     * Save or update the latest bus position.
     * Also caches it in Redis and broadcasts via WebSocket (handled separately).
     */
    public BusPositionResponseDTO saveOrUpdatePosition(BusPositionRequestDTO request) {
        log.info("Received position update for bus {}", request.getBusId());

        // Ensure timestamp
        LocalDateTime time = Optional.ofNullable(request.getTimestamp())
                .orElse(LocalDateTime.now());

        // Create entity
        BusPosition position = BusPosition.builder()
                .busId(request.getBusId())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .direction(Optional.ofNullable(request.getDirection())
                        .orElse(BusDirection.FORWARD))
                .timestamp(time)
                .build();

        // Save to DB (for history)
        BusPosition saved = repository.save(position);

        // Map to response DTO
        BusPositionResponseDTO response = BusPositionResponseDTO.builder()
                .busId(saved.getBusId())
                .latitude(saved.getLatitude())
                .longitude(saved.getLongitude())
                .direction(saved.getDirection())
                .timestamp(saved.getTimestamp())
                .build();

        // Cache latest position in Redis
        redisService.savePosition(response);
        busPositionEventProducer.publishPositionEvent(response);
        log.debug("Position for bus {} cached in Redis", response.getBusId());

        return response;
    }

    /**
     * Get the latest position for a specific bus.
     * Checks Redis first, then falls back to DB.
     */
    public Optional<BusPositionResponseDTO> getLatestPosition(Long busId) {
        // Try Redis first
        Optional<BusPositionResponseDTO> cached = redisService.getPosition(busId);
        if (cached.isPresent()) {
            log.debug("Cache hit for bus {}", busId);
            return cached;
        }

        // Fallback to DB
        log.debug("Cache miss for bus {}, fetching from DB", busId);
        return repository.findTopByBusIdOrderByTimestampDesc(busId)
                .map(pos -> {
                    BusPositionResponseDTO dto = BusPositionResponseDTO.builder()
                            .busId(pos.getBusId())
                            .latitude(pos.getLatitude())
                            .longitude(pos.getLongitude())
                            .timestamp(pos.getTimestamp())
                            .direction(pos.getDirection())
                            .build();
                    redisService.savePosition(dto); // re-cache for future requests
                    return dto;
                });
    }

    /**
     * Get all recorded positions for a specific bus (history or debugging).
     */
    public List<BusPositionResponseDTO> getAllPositionsForBus(Long busId) {
        return repository.findAllByBusId(busId)
                .stream()
                .map(pos -> BusPositionResponseDTO.builder()
                        .busId(pos.getBusId())
                        .latitude(pos.getLatitude())
                        .longitude(pos.getLongitude())
                        .timestamp(pos.getTimestamp())
                        .direction(pos.getDirection())
                        .build())
                .collect(Collectors.toList());
    }

    /**
     * Get all current positions (for all buses).
     * Uses Redis cache first, falls back to DB if empty.
     */
    public List<BusPositionResponseDTO> getAllPositions() {
        List<BusPositionResponseDTO> cached = redisService.getAllPositions();
        if (!cached.isEmpty()) {
            log.debug("Fetched all bus positions from Redis");
            return cached;
        }

        log.debug("Redis cache empty, fetching all positions from DB");
        return repository.findAll()
                .stream()
                .map(pos -> BusPositionResponseDTO.builder()
                        .busId(pos.getBusId())
                        .latitude(pos.getLatitude())
                        .longitude(pos.getLongitude())
                        .timestamp(pos.getTimestamp())
                        .direction(pos.getDirection())
                        .build())
                .collect(Collectors.toList());
    }
}
