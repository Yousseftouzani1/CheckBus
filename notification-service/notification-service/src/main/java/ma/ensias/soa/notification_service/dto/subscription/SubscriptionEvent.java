package ma.ensias.soa.notification_service.dto.subscription;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
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
