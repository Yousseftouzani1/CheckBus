package ma.ensias.soa.trajetservice.kafka;


import lombok.RequiredArgsConstructor;
import ma.ensias.soa.trajetservice.dto.TrajetEventDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TrajetEventProducer {

    private final KafkaTemplate<String, TrajetEventDTO> kafkaTemplate;

    public void sendTrajetEvent(TrajetEventDTO event) {
        kafkaTemplate.send("trajet-status-topic", event);
        System.out.println("📢 Sent TrajetEventDTO: " + event);
    }
}