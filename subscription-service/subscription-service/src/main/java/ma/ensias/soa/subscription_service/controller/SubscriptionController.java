package ma.ensias.soa.subscription_service.controller;

import ma.ensias.soa.subscription_service.entity.Subscription;
import ma.ensias.soa.subscription_service.service.SubscriptionService;
import ma.ensias.soa.subscription_service.Enums.*;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


@RestController
@RequestMapping("/api/subscriptions")
@RequiredArgsConstructor
public class SubscriptionController {

    private final SubscriptionService service;

    @PostMapping("/create")
    public ResponseEntity<Subscription> create(
            @RequestParam Long userId,
            @RequestParam PlanType planType,
            @RequestParam(defaultValue = "true") boolean autoRenew) {
        return ResponseEntity.ok(service.createSubscription(userId, planType, autoRenew));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Subscription>> getByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getUserSubscriptions(userId));
    }

    @PostMapping("/cancel-auto")
    public ResponseEntity<Subscription> cancelAutoRenew(@RequestBody long id) {
        Subscription sub = service.cancelAutoRenew(id);
        return ResponseEntity.ok(sub);
    }
    
    @PostMapping("/cancel-subscription")
    public ResponseEntity<Subscription> cacelSubscription(@RequestBody long id) {
        Subscription sub = service.cancelSubscription(id);
        return ResponseEntity.ok(sub);
    }
    
}
