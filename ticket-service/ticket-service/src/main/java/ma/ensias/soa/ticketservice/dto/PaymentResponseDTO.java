package ma.ensias.soa.ticketservice.dto;

import lombok.*;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private String paymentReference;
    private PaymentStatus status;
    private String message;
} 