package ma.ensias.soa.paymentservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RefundRequestDTO {
    private Long ticketId;
    private Double amount;
}
