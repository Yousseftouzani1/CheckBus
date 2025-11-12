package ma.ensias.soa.ticketservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.enums.TicketStatus;

public interface TicketRepository extends JpaRepository<Ticket, Long> {
    List<Ticket> findByUserId(Long userId);
    List<Ticket> findByStatus(TicketStatus status);
    List<Ticket> findByTripId(Long tripId);
    Ticket findByTripIdAndSeatcode(Long tripId, String seatcode);
    
}
