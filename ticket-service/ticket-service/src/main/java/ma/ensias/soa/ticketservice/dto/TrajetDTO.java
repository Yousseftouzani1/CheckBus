package ma.ensias.soa.ticketservice.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Getter
@Setter
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrajetDTO {
    private Long id;
    private String ligneCode;
    private String depart;
    private String arrivee;
    private boolean active;
}
