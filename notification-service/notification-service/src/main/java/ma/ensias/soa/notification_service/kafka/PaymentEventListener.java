package ma.ensias.soa.notification_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.notification_service.dto.payment.PaymentEvent;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class PaymentEventListener {

    private final NotificationDispatcher dispatcher;

    @KafkaListener(topics = "payment-status-topic", groupId = "notification-service-group")
    public void onTicketPaymentEvent(PaymentEvent event) {
        log.info("📥 Received Ticket PaymentEvent: {}", event);
        dispatcher.handlePaymentEvent(event);
    }

    @KafkaListener(topics = "subscription-payment-topic", groupId = "notification-service-group")
    public void onSubscriptionPaymentEvent(PaymentEvent event) {
        log.info("📥 Received Subscription PaymentEvent: {}", event);
        dispatcher.handlePaymentEvent(event);
    }
}
