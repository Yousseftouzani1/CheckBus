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
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class RedisPositionService {

    private final RedisTemplate<String, Object> redisTemplate;
    private static final String BUS_KEY_PREFIX = "bus:";

    public void savePosition(BusPositionResponseDTO position) {
        String key = BUS_KEY_PREFIX + position.getBusId();
        redisTemplate.opsForValue().set(key, position);
        log.debug("Cached position for bus {}", position.getBusId());
    }

    public Optional<BusPositionResponseDTO> getPosition(Long busId) {
        String key = BUS_KEY_PREFIX + busId;
        Object value = redisTemplate.opsForValue().get(key);
        return Optional.ofNullable((BusPositionResponseDTO) value);
    }

    public List<BusPositionResponseDTO> getAllPositions() {
        Set<String> keys = Objects.requireNonNull(redisTemplate.keys(BUS_KEY_PREFIX + "*"));
        return keys.stream()
                .map(k -> (BusPositionResponseDTO) redisTemplate.opsForValue().get(k))
                .filter(Objects::nonNull)
                .collect(Collectors.toList());
    }

    public void deletePosition(Long busId) {
        redisTemplate.delete(BUS_KEY_PREFIX + busId);
    }
}
