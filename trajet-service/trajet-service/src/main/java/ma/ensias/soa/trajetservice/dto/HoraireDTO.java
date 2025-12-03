package ma.ensias.soa.trajetservice.dto;


import java.sql.Time;

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
public class HoraireDTO {
    private Long id;
    private Long trajetId;
    private Time heureDepart;
    private Time heureArrivee;
    private String jour;
}
 