package ma.ensias.soa.trajetservice.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "trajets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Trajet {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String ligneCode; // e.g. "Ligne 3"

    @Column(nullable = false)
    private String depart; // starting point

    @Column(nullable = false)
    private String arrivee; // ending point

    @ElementCollection
    @CollectionTable(
        name = "trajet_arrets",
        joinColumns = @JoinColumn(name = "trajet_id")
    )
    @Column(name = "arret")
    private List<String> arrets; // intermediate stops

    @Column(nullable = true)
    private double distanceKm;
    @Column(nullable = true)
    private boolean active = true; // route availability
}
