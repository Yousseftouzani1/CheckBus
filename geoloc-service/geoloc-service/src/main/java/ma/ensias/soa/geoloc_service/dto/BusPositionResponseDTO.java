package ma.ensias.soa.geoloc_service.dto;

import lombok.*;
import ma.ensias.soa.geoloc_service.enums.BusDirection;
import java.time.LocalDateTime;

/**
 * DTO for sending position data to clients (UI dashboards, other services, etc.)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusPositionResponseDTO {
    private Long busId;
    private Double latitude;
    private Double longitude;
    private LocalDateTime timestamp;
    private BusDirection direction;
}
