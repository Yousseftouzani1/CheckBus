package ma.ensias.soa.subscription_service.dto;

import ma.ensias.soa.subscription_service.Enums.SubscriptionEventType;
import ma.ensias.soa.subscription_service.Enums.PlanType;


import lombok.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubscriptionEvent {
    private Long subscriptionId;
    private Long userId;
    private String email;
    private PlanType planType;
    private LocalDateTime endDate;
    private SubscriptionEventType eventType; 
}
