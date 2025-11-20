
package ma.ensias.soa.geoloc_service.dto;

import lombok.*;
import ma.ensias.soa.geoloc_service.enums.BusDirection;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

/**
 * DTO for receiving live position updates from buses.
 * This is what the bus (or its onboard system) sends via WebSocket or REST.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusPositionRequestDTO {

    @NotNull(message = "Bus ID is required")
    private Long busId;

    @NotNull(message = "Latitude is required")
    private Double latitude;

    @NotNull(message = "Longitude is required")
    private Double longitude;

    private BusDirection direction; // Optional if inferred automatically

    private LocalDateTime timestamp; // Optional; server can generate if null
}
