package ma.ensias.soa.subscription_service.repository;

import ma.ensias.soa.subscription_service.entity.Subscription;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    List<Subscription> findAllByUserId(Long userId);
}