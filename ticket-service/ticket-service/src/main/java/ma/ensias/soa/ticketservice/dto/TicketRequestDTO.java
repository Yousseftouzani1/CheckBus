package ma.ensias.soa.ticketservice.dto;


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
public class TicketRequestDTO {
    private Long userId;

    private Long tripId;

    private String seatcode;

    private Double price;

    private String paymentMethod;
}
