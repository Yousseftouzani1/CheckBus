package ma.ensias.soa.notification_service.dto.base;

import lombok.*;
import java.time.Instant;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BaseEvent {

    private String eventId;          // Unique ID for event tracking
    private String eventType;        // Type: SUBSCRIPTION_CREATED, PAYMENT_SUCCESS, etc.
    private Instant timestamp;       // When event was emitted
    private String sourceService;    // e.g. "subscription-service"

}
 