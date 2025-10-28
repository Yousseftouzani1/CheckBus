package ma.ensias.soa.subscription_service.service;

import ma.ensias.soa.subscription_service.dto.*;
import ma.ensias.soa.subscription_service.Enums.*;
import ma.ensias.soa.subscription_service.kafka.SubscriptionEventProducer;
import ma.ensias.soa.subscription_service.entity.*;
import ma.ensias.soa.subscription_service.repository.*;
import ma.ensias.soa.subscription_service.client.*;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;


@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionRepository repository;
    private final UserClient userClient;
    private final PaymentClient paymentClient;
    private final SubscriptionEventProducer eventProducer;
    private final int YEARLY_AMMOUNT = 499;
    private final int MONTHLY_AMMOUNT = 49;

    public Subscription createSubscription(Long userId, PlanType planType, boolean autoRenew) {
        UserDTO user = userClient.getUserById(userId);

        double amount = (planType == PlanType.ANNUAL)? YEARLY_AMMOUNT : MONTHLY_AMMOUNT;
        LocalDateTime startDate = LocalDateTime.now();
        LocalDateTime endDate = (planType == PlanType.ANNUAL)
                ? startDate.plusYears(1)
                : startDate.plusMonths(1);

        Subscription subscription = Subscription.builder()
                .userId(userId)
                .planType(planType)
                .price(amount)
                .startDate(startDate)
                .endDate(endDate)
                .status(SubscriptionStatus.PENDING)
                .autoRenew(autoRenew)
                .build();

        Subscription saved = repository.save(subscription);

        PaymentRequestDTO paymentRequest = PaymentRequestDTO.builder()
                .subscriptionId(saved.getId())
                .userId(userId)
                .email(user.getEmail())
                .amount(amount)
                .planType(planType)
                .build();

        PaymentResponseDTO paymentResponse = paymentClient.processPayment(paymentRequest);

        if ( paymentResponse.getStatus() == PaymentStatus.SUCCESS) {
            saved.setStatus(SubscriptionStatus.ACTIVE);
            repository.save(saved);

            eventProducer.publishEvent(SubscriptionEvent.builder()
                    .subscriptionId(saved.getId())
                    .userId(user.getId())
                    .email(user.getEmail())
                    .planType(planType)
                    .endDate(endDate)
                    .eventType(SubscriptionEventType.SUBSCRIPTION_CREATED)
                    .build());
        } else {
            saved.setStatus(SubscriptionStatus.CANCELED);
            repository.save(saved);
        }

        return saved;
    }

    public List<Subscription> getUserSubscriptions(Long userId) {
        return repository.findAllByUserId(userId);
    }

    public void cancelAutoRenew(Long id) {
        Subscription sub = repository.findById(id)
            .orElseThrow(() -> new RuntimeException("Subscription not found with ID:" + id));
        
        sub.setAutoRenew(false);
        repository.save(sub);    
        
    }

    public void cancelSubscription(Subscription subscription) {
        subscription.setStatus(SubscriptionStatus.CANCELED);
        repository.save(subscription);
    }
}
