package ma.ensias.soa.notification_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.notification_service.dto.subscription.SubscriptionEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class SubscriptionEventListener {

    private final NotificationDispatcher dispatcher;

    @KafkaListener(topics = "subscription-event-topic", groupId = "notification-service-group", containerFactory = "subscriptionKafkaListenerContainerFactory")
    public void onSubscriptionEvent(SubscriptionEvent event) {
        log.info("📥 Received SubscriptionEvent from Kafka: {}", event);
        dispatcher.handleSubscriptionEvent(event);
    }
}
