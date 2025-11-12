package ma.ensias.soa.subscription_service.dto;

import ma.ensias.soa.subscription_service.Enums.PlanType;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestDTO {
    private Long subscriptionId;
    private Long userId;
    private String email;
    private double amount;
    private PlanType planType;
}
