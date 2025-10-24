package ma.ensias.soa.ticketservice.dto;

import java.sql.Timestamp;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.ensias.soa.ticketservice.enums.TicketStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class TicketResponseDTO {

    private Long id;
    private Long userId;
    private Long tripId;
    private String seatcode;   // seat code 
    private Double price;

    private TicketStatus status;
    private String qrCode;

    private Timestamp createdAt;
    private Timestamp updatedAt;

}
