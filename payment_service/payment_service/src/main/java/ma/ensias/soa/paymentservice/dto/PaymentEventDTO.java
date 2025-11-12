package ma.ensias.soa.paymentservice.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import lombok.NoArgsConstructor;
import ma.ensias.soa.paymentservice.enums.PaymentStatus;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PaymentEventDTO {
    private Long ticketId;
    private String paymentReference;
    private Double amount;
    private PaymentStatus status;
    private Timestamp confirmedAt;
    private Long subscriptionId;     
}