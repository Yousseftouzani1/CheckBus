package ma.ensias.soa.trajetservice.dto;



import lombok.*;
import java.sql.Timestamp;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrajetEventDTO {
    private Long trajetId;
    private String status; // e.g., "UPDATED", "CANCELLED", "DELAYED"
    private String message;
    private Timestamp timestamp;
}
