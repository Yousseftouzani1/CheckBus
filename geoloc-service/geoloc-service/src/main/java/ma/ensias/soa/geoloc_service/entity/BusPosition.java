package ma.ensias.soa.geoloc_service.entity;



import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import ma.ensias.soa.geoloc_service.enums.BusDirection;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BusPosition {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long busId;              // references Bus from User Service
    private double latitude;
    private double longitude;

    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    private BusDirection direction;  // FORWARD or BACKWARD
}

