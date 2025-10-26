package ma.ensias.soa.subscription_service.kafka;

import ma.ensias.soa.subscription_service.dto.SubscriptionEvent;

import lombok.RequiredArgsConstructor;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class SubscriptionEventProducer {

    private final KafkaTemplate<String, SubscriptionEvent> kafkaTemplate;

    public void publishEvent(SubscriptionEvent event) {
        kafkaTemplate.send("subscription-event-topic", event);
    }
}
