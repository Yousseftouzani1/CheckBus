package ma.ensias.soa.geoloc_service.scheduler;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.geoloc_service.dto.BusPositionResponseDTO;
import ma.ensias.soa.geoloc_service.entity.BusPosition;
import ma.ensias.soa.geoloc_service.repository.BusPositionRepository;
import ma.ensias.soa.geoloc_service.service.RedisPositionService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Periodic tasks: archive live positions & clean Redis.
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class PositionScheduler {

    private final RedisPositionService redisService;
    private final BusPositionRepository repository;

    // every 10 minutes
    @Scheduled(cron = "0 */10 * * * *")
    public void archivePositions() {
        List<BusPositionResponseDTO> cachedPositions = redisService.getAllPositions();
        log.info("Archiving {} positions to DB", cachedPositions.size());

        cachedPositions.forEach(pos -> {
            BusPosition entity = BusPosition.builder()
                    .busId(pos.getBusId())
                    .latitude(pos.getLatitude())
                    .longitude(pos.getLongitude())
                    .direction(pos.getDirection())
                    .timestamp(LocalDateTime.now())
                    .build();
            repository.save(entity);
        });
    }
}
