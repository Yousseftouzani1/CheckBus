package ma.ensias.soa.ticketservice.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
/// Response DTO
public class PaymentInfoDTO {

    private String paymentReference;
    private Double price;
    private String method;
    private Timestamp confirmedAt;
    private Timestamp lastUpdate;
    private Long ticketId;
    private String status;
}

