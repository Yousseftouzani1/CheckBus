package ma.ensias.soa.geoloc_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.geoloc_service.dto.BusPositionResponseDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class BusPositionEventProducer {

    private final KafkaTemplate<String, BusPositionResponseDTO> kafkaTemplate;

    public void publishPositionEvent(BusPositionResponseDTO position) {
        kafkaTemplate.send("bus.position.update", position);
        log.debug("Published Kafka event for bus {}", position.getBusId());
    }
}
