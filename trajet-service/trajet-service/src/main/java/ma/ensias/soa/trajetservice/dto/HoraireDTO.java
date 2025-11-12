package ma.ensias.soa.trajetservice.dto;


import lombok.*;
import java.sql.Time;

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
