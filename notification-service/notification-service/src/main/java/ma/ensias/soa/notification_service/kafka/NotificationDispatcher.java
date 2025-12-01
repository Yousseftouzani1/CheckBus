package ma.ensias.soa.notification_service.kafka;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.notification_service.dto.subscription.SubscriptionEvent;
import ma.ensias.soa.notification_service.dto.payment.PaymentEvent;
import ma.ensias.soa.notification_service.dto.ticket.RefundRequestEvent;
import ma.ensias.soa.notification_service.service.NotificationService;
import org.springframework.stereotype.Component;

@Slf4j
@Component
@RequiredArgsConstructor
public class NotificationDispatcher {

    private final NotificationService notificationService;

    public void handleSubscriptionEvent(SubscriptionEvent event) {
        log.info("📩 Handling SubscriptionEvent: {}", event);
        notificationService.processSubscriptionEvent(event);
    }

    public void handlePaymentEvent(PaymentEvent event) {
        log.info("💰 Handling PaymentEvent: {}", event);
        notificationService.processPaymentEvent(event);
    }

    public void handleRefundEvent(RefundRequestEvent event) {
        log.info("🔄 Handling RefundRequestEvent: {}", event);
        notificationService.processRefundEvent(event);
    }
}
