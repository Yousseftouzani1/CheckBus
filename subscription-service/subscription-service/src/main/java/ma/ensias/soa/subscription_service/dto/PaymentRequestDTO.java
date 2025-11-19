package ma.ensias.soa.subscription_service.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.ensias.soa.subscription_service.Enums.PlanType;

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

