package ma.ensias.soa.paymentservice.dto;


import java.sql.Timestamp;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    private Long ticketId;
    private Double amount;
    private String method;
    private Timestamp createdAt;
}
