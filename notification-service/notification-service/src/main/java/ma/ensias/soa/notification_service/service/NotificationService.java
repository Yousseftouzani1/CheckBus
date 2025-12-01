package ma.ensias.soa.notification_service.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.notification_service.entity.Notification;
import ma.ensias.soa.notification_service.enums.NotificationType;
import ma.ensias.soa.notification_service.dto.subscription.SubscriptionEvent;
import ma.ensias.soa.notification_service.dto.subscription.SubscriptionEventType;
import ma.ensias.soa.notification_service.dto.api.NotificationResponse;
import ma.ensias.soa.notification_service.dto.payment.PaymentEvent;
import ma.ensias.soa.notification_service.dto.ticket.RefundRequestEvent;
import ma.ensias.soa.notification_service.repository.NotificationRepository;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import org.thymeleaf.context.Context;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Slf4j
@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationEmitterService emitterService;
    private final EmailService emailService;

    // 🔥 -----------------------------------------
    // 1. HANDLE SUBSCRIPTION EVENTS
    // 🔥 -----------------------------------------
    public void processSubscriptionEvent(SubscriptionEvent event) {

        Notification notification = Notification.builder()
                .userId(event.getUserId())
                .title(buildSubscriptionTitle(event))
                .message(buildSubscriptionMessage(event))
                .type(NotificationType.SUBSCRIPTION)
                .createdAt(LocalDateTime.now())
                .seen(false)
                .build();

        notificationRepository.save(notification);
        emitterService.sendNotification(notification.getUserId(), mapToResponse(notification));

        if (event.getEmail() != null) {

            Context ctx = new Context();
            ctx.setVariable("username", "User"); // Later replace with user-service lookup
            ctx.setVariable("planType", event.getPlanType());
            ctx.setVariable("endDate", event.getEndDate());

            // Only handle created events (others don't exist in your system)
            if (event.getEventType() == SubscriptionEventType.SUBSCRIPTION_CREATED) {

                String template = "emails/subscription-created";

                emailService.sendHtmlEmail(
                        event.getEmail(),
                        "Subscription Activated",
                        template,
                        ctx);
            }

        }

        log.info("📌 Subscription notification stored for user {}", event.getUserId());
    }

    private String buildSubscriptionTitle(SubscriptionEvent event) {
        switch (event.getEventType()) {
            case SUBSCRIPTION_CREATED:
                return "Subscription Activated";
            case SUBSCRIPTION_RENEWED:
                return "Subscription Renewed";
            case SUBSCRIPTION_EXPIRED:
                return "Subscription Expired";
            case SUBSCRIPTION_CANCELED:
                return "Subscription Canceled";
            default:
                return "Subscription Update";
        }
    }

    private String buildSubscriptionMessage(SubscriptionEvent event) {
        switch (event.getEventType()) {
            case SUBSCRIPTION_CREATED:
                return "Your " + event.getPlanType() + " subscription has been activated.";
            case SUBSCRIPTION_RENEWED:
                return "Your subscription has been renewed until " + event.getEndDate() + ".";
            case SUBSCRIPTION_EXPIRED:
                return "Your subscription has expired on " + event.getEndDate() + ".";
            case SUBSCRIPTION_CANCELED:
                return "Your subscription has been canceled.";
            default:
                return "Subscription update received.";
        }
    }

    // 🔥 -----------------------------------------
    // 2. HANDLE PAYMENT EVENTS
    // 🔥 -----------------------------------------
    public void processPaymentEvent(PaymentEvent event) {

        String title;
        String message;

        switch (event.getStatus()) {
            case SUCCESS -> {
                title = "Payment Successful";
                message = "Your payment of " + event.getAmount() + " MAD was confirmed.";
            }
            case FAILED -> {
                title = "Payment Failed";
                message = "Your payment failed. Please try again.";
            }
            case REFUNDED -> {
                title = "Payment Refunded";
                message = "A refund of " + event.getAmount() + " MAD has been issued.";
            }
            default -> {
                title = "Payment Update";
                message = "A payment update was received.";
            }
        }

        Notification notification = Notification.builder()
                .userId(resolveUserId(event)) // We will refine this later
                .title(title)
                .message(message)
                .type(NotificationType.PAYMENT)
                .createdAt(LocalDateTime.now())
                .seen(false)
                .build();

        notificationRepository.save(notification);
        emitterService.sendNotification(notification.getUserId(), mapToResponse(notification));

        log.info("📌 Payment notification stored for subscriptionId={}, ticketId={}",
                event.getSubscriptionId(), event.getTicketId());
    }

    // TODO: We will refine this logic later (when we know where userId comes from)
    private Long resolveUserId(PaymentEvent event) {
        return 1L; // placeholder for now
    }

    // 🔥 -----------------------------------------
    // 3. HANDLE REFUND EVENTS
    // 🔥 -----------------------------------------
    public void processRefundEvent(RefundRequestEvent event) {

        Notification notification = Notification.builder()
                .userId(null) // we will fill this later
                .title("Refund Requested")
                .message("Your refund request for ticket " + event.getTicketId()
                        + " (" + event.getAmount() + " MAD) has been submitted.")
                .type(NotificationType.REFUND)
                .createdAt(LocalDateTime.now())
                .seen(false)
                .build();

        notificationRepository.save(notification);
        emitterService.sendNotification(notification.getUserId(), mapToResponse(notification));

        log.info("📌 Refund notification stored for ticketId {}", event.getTicketId());
    }
    // -----------------------------------------
    // API METHODS
    // -----------------------------------------

    public List<NotificationResponse> getNotificationsByUserId(Long userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public Long countUnread(Long userId) {
        return notificationRepository.countByUserIdAndSeenFalse(userId);
    }

    public void markAsSeen(Long id) {
        Notification notif = notificationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notification not found"));

        notif.setSeen(true);
        notificationRepository.save(notif);
    }

    public void markAllAsSeen(Long userId) {
        notificationRepository.markAllSeenByUserId(userId);
    }

    public void deleteNotification(Long id) {
        notificationRepository.deleteById(id);
    }

    private NotificationResponse mapToResponse(Notification notif) {
        return NotificationResponse.builder()
                .id(notif.getId())
                .title(notif.getTitle())
                .message(notif.getMessage())
                .createdAt(notif.getCreatedAt())
                .seen(notif.isSeen())
                .build();
    }

    public Page<NotificationResponse> getNotifications(
            Long userId,
            int page,
            int size,
            Boolean seen,
            NotificationType type,
            LocalDateTime from,
            LocalDateTime to) {
        Pageable pageable = PageRequest.of(page, size);

        Page<Notification> results;

        // Case 1: date range present
        if (from != null && to != null) {
            if (type != null && seen != null) {
                results = notificationRepository
                        .findByUserIdAndTypeAndSeenAndCreatedAtBetweenOrderByCreatedAtDesc(
                                userId, type, seen, from, to, pageable);
            } else if (type != null) {
                results = notificationRepository
                        .findByUserIdAndTypeAndCreatedAtBetweenOrderByCreatedAtDesc(
                                userId, type, from, to, pageable);
            } else if (seen != null) {
                results = notificationRepository
                        .findByUserIdAndSeenAndCreatedAtBetweenOrderByCreatedAtDesc(
                                userId, seen, from, to, pageable);
            } else {
                results = notificationRepository
                        .findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
                                userId, from, to, pageable);
            }
        }

        // Case 2: no date range but type/seen used
        else if (type != null && seen != null) {
            results = notificationRepository.findByUserIdAndTypeAndSeenOrderByCreatedAtDesc(
                    userId, type, seen, pageable);
        } else if (type != null) {
            results = notificationRepository.findByUserIdAndTypeOrderByCreatedAtDesc(
                    userId, type, pageable);
        } else if (seen != null) {
            results = notificationRepository.findByUserIdAndSeenOrderByCreatedAtDesc(
                    userId, seen, pageable);
        }

        // Case 3: no filtering at all
        else {
            results = notificationRepository.findByUserIdOrderByCreatedAtDesc(
                    userId, pageable);
        }

        return results.map(this::mapToResponse);
    }

}
