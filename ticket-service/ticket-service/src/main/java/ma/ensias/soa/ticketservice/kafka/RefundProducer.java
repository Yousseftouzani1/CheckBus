package ma.ensias.soa.ticketservice.kafka;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.RefundRequestDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefundProducer {

    private final KafkaTemplate<String, RefundRequestDTO> kafkaTemplate;

    public void sendRefundRequest(RefundRequestDTO refundRequest) {
        kafkaTemplate.send("refund-request-topic", refundRequest);
        System.out.println("📤 Refund event sent to Kafka: " + refundRequest);
    }
}

