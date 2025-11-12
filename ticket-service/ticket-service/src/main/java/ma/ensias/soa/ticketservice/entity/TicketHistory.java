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
import ma.ensias.soa.ticketservice.enums.TicketStatus;

@Entity
@Table(name = "ticket_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TicketHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "history_id")
    private long id;
 
   // 1....N
    @ManyToOne
    @JoinColumn(
        name = "ticket_id",
        referencedColumnName = "ticket_id",
        foreignKey = @ForeignKey(name = "ticket_history_ticket_fk"),
        nullable = false
    )
    private Ticket ticket;

    // The previous status of the ticket
    @Enumerated(EnumType.STRING)
    @Column(name = "previous_status", nullable = true, length = 30)
    private TicketStatus previousStatus;

    // The new status after a change
    @Enumerated(EnumType.STRING)
    @Column(name = "new_status", nullable = false, length = 30)
    private TicketStatus newStatus;

    // Timestamp of the status change
    @Column(name = "changed_at", nullable = false)
    private Timestamp changedAt;

    // Who or what caused the change (e.g., USER, SYSTEM, PAYMENT_SERVICE)
    @Column(name = "changed_by", nullable = false, length = 50)
    private String changedBy;


    @Column(name = "archived", nullable = false)
    private boolean archived;
}
