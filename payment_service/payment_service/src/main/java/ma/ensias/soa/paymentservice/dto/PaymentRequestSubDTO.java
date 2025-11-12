package ma.ensias.soa.paymentservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.ensias.soa.paymentservice.enums.PlanType;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentRequestSubDTO {
    private Long subscriptionId;
    private Long userId;
    private String email;
    private double amount;
    private PlanType planType;
}
