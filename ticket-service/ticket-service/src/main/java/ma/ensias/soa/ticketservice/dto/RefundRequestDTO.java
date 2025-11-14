package ma.ensias.soa.ticketservice.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Getter
@Setter
public class RefundRequestDTO {
    private Long ticketId;
    private Double amount;
}
