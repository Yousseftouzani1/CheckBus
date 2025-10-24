package ma.ensias.soa.ticketservice.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.ForeignKey;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;
 
@Entity
@Table(name = "payment_info")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PaymentInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "payment_id")
    private long id;
// 1.....1
@ManyToOne
@JoinColumn(
    name = "ticket_id",
    referencedColumnName = "ticket_id",
    foreignKey = @ForeignKey(name = "payment_info_ticket_fk"),
    nullable = false
)
private Ticket ticket;

 
    @Column(name = "payment_reference", nullable = false, unique = true, length = 300)
    private String paymentReference;

    @Column(name = "price", nullable = false)
    private Double price;

    @Column(name = "method", nullable = false, length = 90)
    private String method;

    @Column(name = "confirmed_at")
    private Timestamp confirmedAt;

    @Column(name = "last_update")
    private Timestamp lastUpdate;

@Enumerated(EnumType.STRING)
@Column(name = "status", nullable = false)
private PaymentStatus status ;
}
