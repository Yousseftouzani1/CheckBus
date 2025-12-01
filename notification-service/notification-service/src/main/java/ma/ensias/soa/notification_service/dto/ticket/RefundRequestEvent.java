package ma.ensias.soa.notification_service.dto.ticket;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequestEvent {

    private Long ticketId;
    private Double amount;
}