package ma.ensias.soa.ticketservice.dto;

import java.sql.Timestamp;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestDTO {
    private Long ticketId;
    private Double amount;
    private String method; // CARD, PAYPAL, etc.
    private Timestamp createdAt;
}
 