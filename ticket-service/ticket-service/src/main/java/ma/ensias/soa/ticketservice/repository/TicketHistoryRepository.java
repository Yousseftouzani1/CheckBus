package ma.ensias.soa.ticketservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.entity.TicketHistory;

public interface TicketHistoryRepository extends JpaRepository<TicketHistory,Long>{
List<TicketHistory> findByTicket(Ticket ticket);
} 
