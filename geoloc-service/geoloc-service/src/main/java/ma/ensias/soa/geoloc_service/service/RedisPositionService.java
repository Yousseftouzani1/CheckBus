package ma.ensias.soa.geoloc_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.geoloc_service.dto.BusPositionResponseDTO;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Provides fast caching and retrieval of latest bus positions.
 * Now handles invalid or legacy Redis entries safely to avoid scheduler crashes.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisPositionService {

    private final RedisTemplate<String, BusPositionResponseDTO> redisTemplate;
    private static final String PREFIX = "bus:";

    /**
     * Save (or update) a bus position in Redis.
     */
    public void savePosition(BusPositionResponseDTO position) {
        String key = PREFIX + position.getBusId();
        redisTemplate.opsForValue().set(key, position);
        log.debug("✅ Cached position for bus {}", position.getBusId());
    }

    /**
     * Retrieve a bus position by its ID.
     */
    public Optional<BusPositionResponseDTO> getPosition(Long busId) {
        String key = PREFIX + busId;
        try {
            BusPositionResponseDTO dto = redisTemplate.opsForValue().get(key);
            return Optional.ofNullable(dto);
        } catch (ClassCastException e) {
            log.warn("⚠️ Invalid Redis data type for bus {} (likely old cache entry)", busId);
            return Optional.empty();
        } catch (Exception e) {
            log.error("❌ Error reading Redis entry for bus {}", busId, e);
            return Optional.empty();
        }
    }

    /**
     * Retrieve all cached positions safely (skipping broken or legacy entries).
     */
    public List<BusPositionResponseDTO> getAllPositions() {
        Set<String> keys = redisTemplate.keys(PREFIX + "*");
        if (keys == null || keys.isEmpty()) return List.of();

        return keys.stream()
                .map(key -> {
                    try {
                        Object obj = redisTemplate.opsForValue().get(key);
                        if (obj instanceof BusPositionResponseDTO dto) {
                            return dto;
                        } else {
                            log.warn("⚠️ Skipping invalid Redis entry for key {}: {}", key, obj != null ? obj.getClass() : "null");
                            return null;
                        }
                    } catch (Exception e) {
                        log.error("❌ Error reading Redis entry for key {}", key, e);
                        return null;
                    }
                })
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    /**
     * Delete a specific bus position from Redis.
     */
    public void deletePosition(Long busId) {
        redisTemplate.delete(PREFIX + busId);
        log.debug("🗑️ Deleted cached position for bus {}", busId);
    }
}
