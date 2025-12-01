package ma.ensias.soa.notification_service.dto.payment;

import lombok.*;
import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentEvent {

    private Long ticketId;
    private String paymentReference;
    private Double amount;
    private PaymentStatus status;
    private Timestamp confirmedAt;
    private Long subscriptionId;   // Null if payment is for a ticket
}
