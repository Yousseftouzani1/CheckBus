package ma.ensias.soa.subscription_service.dto;

import ma.ensias.soa.subscription_service.Enums.PaymentStatus;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private String paymentReference;
    private PaymentStatus status;
    private String message;

}
