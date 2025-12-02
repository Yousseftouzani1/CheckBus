package ma.ensias.soa.notification_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.notification_service.dto.ticket.RefundRequestEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class RefundEventListener {

    private final NotificationDispatcher dispatcher;

    @KafkaListener(topics = "refund-request-topic", groupId = "notification-service-group", containerFactory = "refundKafkaListenerContainerFactory")
    public void onRefundEvent(RefundRequestEvent event) {
        log.info("📥 Received RefundRequestEvent: {}", event);
        dispatcher.handleRefundEvent(event);
    }
}
