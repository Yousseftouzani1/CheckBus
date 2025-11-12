package ma.ensias.soa.ticketservice.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
// request dto
public class PaymentEventDTO {

    private Long ticketId;
    private String paymentReference;
    private Double amount;
    private PaymentStatus status; // e.g. PENDING, SUCCESS, FAILED, REFUNDED
    private Timestamp confirmedAt;
}

