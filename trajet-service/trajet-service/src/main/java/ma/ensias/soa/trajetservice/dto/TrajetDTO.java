package ma.ensias.soa.trajetservice.dto;


import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
    private List<HoraireDTO> horaires;
}
 