package ma.ensias.soa.paymentservice.kafka;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.paymentservice.dto.PaymentEventDTO;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventProducer {

    private final KafkaTemplate<String, PaymentEventDTO> kafkaTemplate;

    public void sendPaymentEvent(PaymentEventDTO event) {
        kafkaTemplate.send("payment-status-topic", event);
        System.out.println(" Sent PaymentEventDTO to Kafka: " + event);
    }
    
    public void sendSubscriptionPaymentEvent(PaymentEventDTO event) {
        kafkaTemplate.send("subscription-payment-topic", event);
    }  
}