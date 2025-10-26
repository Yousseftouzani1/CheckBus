package ma.ensias.soa.subscription_service.dto;

import ma.ensias.soa.subscription_service.Enums.Status;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentResponseDTO {
    private Status status; 
    private String transactionId;
}
