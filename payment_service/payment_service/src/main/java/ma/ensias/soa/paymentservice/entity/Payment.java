package ma.ensias.soa.paymentservice.entity;

import java.sql.Timestamp;
import jakarta.persistence.*;
import lombok.*;
import ma.ensias.soa.paymentservice.enums.PaymentStatus;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "payments") 
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ticket_id", nullable = true)
    private Long ticketId; // ID of the ticket being paid for

    @Column(nullable = false)
    private Double amount; // Payment amount

    @Column(length = 50,nullable = true)
    private String method; // e.g. CARD, PAYPAL, CASH

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private PaymentStatus status; // PENDING, SUCCESS, FAILED, REFUNDED
    @Column(name="subscription_id", nullable=true)
    private Long subscription_id;
    @Column(name = "payment_reference", unique = true, length = 100,nullable = false)
    private String paymentReference; // External transaction ID
    @Column(name = "createdAt")
    private Timestamp createdAt;
    
    private Timestamp updatedAt;
}
