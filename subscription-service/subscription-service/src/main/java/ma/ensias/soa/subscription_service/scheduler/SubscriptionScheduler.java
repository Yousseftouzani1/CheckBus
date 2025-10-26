package ma.ensias.soa.subscription_service.scheduler;

import ma.ensias.soa.subscription_service.Enums.SubscriptionStatus;
import ma.ensias.soa.subscription_service.repository.SubscriptionRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
public class SubscriptionScheduler {

    private final SubscriptionRepository repository;

    @Scheduled(cron = "0 0 * * * *") // Every hour
    public void expireOldSubscriptions() {
        repository.findAll().forEach(sub -> {
            if (sub.getEndDate().isBefore(LocalDateTime.now())
                    && sub.getStatus() == SubscriptionStatus.ACTIVE) {
                sub.setStatus(SubscriptionStatus.EXPIRED);
                repository.save(sub);
            }
        });
    }
}