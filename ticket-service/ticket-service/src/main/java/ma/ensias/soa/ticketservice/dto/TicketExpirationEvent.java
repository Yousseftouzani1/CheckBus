package ma.ensias.soa.ticketservice.dto;


import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketExpirationEvent {
    private Long ticketId;
    private long expirationTime; // timestamp in ms (System.currentTimeMillis() + 15min)
}

