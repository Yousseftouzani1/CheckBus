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
// response just the data sent for the user on the history
public class TicketHistoryDTO {

    private Long id;
        private Long ticketId;             
    private TicketStatus previousStatus;
    private TicketStatus newStatus;
    private Timestamp changedAt;
    private String changedBy;
    private String description;
}

