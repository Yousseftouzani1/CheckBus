package ma.ensias.soa.trajetservice.entity;

import jakarta.persistence.*;
import lombok.*;

import java.sql.Time;

@Entity
@Table(name = "horaires")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Horaire {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "trajet_id", nullable = false)
    private Trajet trajet;

    @Column(nullable = false)
    private Time heureDepart;

    @Column(nullable = false)
    private Time heureArrivee;

    @Column(nullable = false)
    private String jour; // e.g. "Lundi", "Mardi", etc.
}
