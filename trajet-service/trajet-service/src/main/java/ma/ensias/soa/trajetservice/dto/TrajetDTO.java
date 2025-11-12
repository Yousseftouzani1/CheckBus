package ma.ensias.soa.trajetservice.dto;


import lombok.*;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrajetDTO {
    private Long id;
    private String ligneCode;
    private String depart;
    private String arrivee;
    private List<String> arrets;
    private double distanceKm;
    private boolean active;
}
