package ma.ensias.soa.ticketservice.entity;

import java.sql.Timestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import ma.ensias.soa.ticketservice.enums.TicketStatus;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity 
@Table(name="tickets")
public class Ticket {

// the id of the ticket 
@GeneratedValue(strategy=GenerationType.IDENTITY)
@Id
@Column(name="ticket_id")
private long id;

// user id assocated with the ticket 
@Column(name="userId")

private long userId;

// the trip id associated for this ticket 
@Column(name="tripId")

private long tripId;


// the number of the seat 
@Column(name="seatcode")

private String seatcode;

// status 
@Enumerated(EnumType.STRING)
private TicketStatus status;
// price
@Column(name="price" , nullable = false)
private double price;


// Creation and update timestamps
private Timestamp createdAt;

private Timestamp updatedAt;

private String qr_code;



}
