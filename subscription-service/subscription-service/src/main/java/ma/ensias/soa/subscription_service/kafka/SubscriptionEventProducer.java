package ma.ensias.soa.subscription_service.kafka;

import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.subscription_service.dto.SubscriptionEvent;

@Service
@RequiredArgsConstructor
public class SubscriptionEventProducer {

    private final KafkaTemplate<String, SubscriptionEvent> kafkaTemplate;

    public void publishEvent(SubscriptionEvent event) {
        kafkaTemplate.send("subscription-event-topic", event);
    }
}
