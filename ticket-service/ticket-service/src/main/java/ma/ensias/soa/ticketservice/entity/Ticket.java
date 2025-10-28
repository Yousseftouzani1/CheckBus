package ma.ensias.soa.ticketservice.entity;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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

// The Id of the ticket 
@GeneratedValue(strategy=GenerationType.IDENTITY)
@Id
@Column(name="ticket_id")
private Long id;

// User Id assocated with the ticket 
@Column(name="userId")
private long userId;

// The trip id associated for this ticket 
@Column(name="tripId")
private Long tripId;


// The number of the seat 
@Column(name="seatcode")
private String seatcode;

// status 
@Enumerated(EnumType.STRING)
private TicketStatus status;

// Price
@Column(name="price" , nullable = false)
private double price;

// Creation and update timestamps
@Column(name="createdAt")
private Timestamp createdAt;

@Column(name="updatedAt")
private Timestamp updatedAt;


@Column(name="qr_code")
private String qr_code;

@Column(name="reservation_Time")
private Timestamp reservation_Time;

@OneToMany(mappedBy = "ticket", cascade = CascadeType.ALL, orphanRemoval = true)
private List<PaymentInfo> payments;

}
