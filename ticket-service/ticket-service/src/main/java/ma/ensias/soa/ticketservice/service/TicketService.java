package ma.ensias.soa.ticketservice.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import ma.ensias.soa.ticketservice.dto.PaymentEventDTO;
import ma.ensias.soa.ticketservice.dto.TicketRequestDTO;
import ma.ensias.soa.ticketservice.dto.TicketResponseDTO;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.enums.TicketStatus;
import ma.ensias.soa.ticketservice.exception.NoSeatsAvailableException;
import ma.ensias.soa.ticketservice.exception.PayementFailedException;
import ma.ensias.soa.ticketservice.exception.TicketNotFoundException;
import ma.ensias.soa.ticketservice.exception.UnChangeableException;
import ma.ensias.soa.ticketservice.mapper.TicketMapper;
import ma.ensias.soa.ticketservice.repository.TicketRepository;

@Service
public class TicketService {

        private final TicketRepository repo;
        private final TicketMapper TicketMapper;
        private final TicketHistoryService ticketHistoryService ;

        public TicketService(TicketRepository repo,TicketMapper TicketMapper,TicketHistoryService ticketHistoryService){
        this.repo=repo;
        this.TicketMapper=TicketMapper;
        this.ticketHistoryService= ticketHistoryService;
    }

    
public List<TicketResponseDTO> getTicketsByUserId(Long userId) {
    List<Ticket> tickets = repo.findByUserId(userId);
    List<TicketResponseDTO> ticketDtos = new ArrayList<>();

    for (Ticket ticket : tickets) {
        ticketDtos.add(TicketMapper.toDto(ticket));
    }

    return ticketDtos;
}





/*
 * Reserve a seat for 15 minutes
 */
public TicketResponseDTO reserveTicket(TicketRequestDTO ticketRequest) {
    // 1. Check if seat already exists
    Ticket existing = repo.findByTripIdAndSeatcode(
        ticketRequest.getTripId(),
        ticketRequest.getSeatcode()
    );

    // 2. Verify seat availability
    if (existing != null &&
        (existing.getStatus() == TicketStatus.RESERVED ||
            existing.getStatus() == TicketStatus.PAID ||
            existing.getStatus() == TicketStatus.VALIDATED)) {
        
    throw new NoSeatsAvailableException();

    }

    // 3. Map DTO → Entity
    Ticket ticket = TicketMapper.toEntity(ticketRequest);
    ticket.setStatus(TicketStatus.RESERVED);
    ticket.setCreatedAt(new Timestamp(System.currentTimeMillis()));
    ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

    // 4. Save to DB
    Ticket savedTicket = repo.save(ticket);

    
    // Publish delayed expiration event using Kafka

    // TODO: Add expiration logic (cancel reservation after 15 minutes if unpaid)

    // 5. Return DTO
    return TicketMapper.toDto(savedTicket);
}


public TicketResponseDTO buyTicket(Long ticketId, PaymentEventDTO paymentEvent) {
    Ticket ticket = repo.findById(ticketId)
                        .orElseThrow(() -> new TicketNotFoundException(ticketId));


    // TODO:Confirm payment with payment_service (via REST call or Kafka event)


    //boolean paymentConfirmed = paymentService.confirmPayment(paymentEvent);
boolean paymentConfirmed=true;
    if (paymentConfirmed) {
        ticket.setStatus(TicketStatus.PAID);
        ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Ticket saved = repo.save(ticket);
        return TicketMapper.toDto(saved);
    } else {
        throw new PayementFailedException("Payment failed.");
    }
}

// change a ticket
public TicketResponseDTO changeTicket(Long ticketId, TicketRequestDTO updateRequest) {
    Ticket ticket = repo.findById(ticketId)
                        .orElseThrow(() -> new TicketNotFoundException(ticketId));

    // 1. Check if modification is allowed
    if (ticket.getStatus() == TicketStatus.VALIDATED || ticket.getStatus() == TicketStatus.EXPIRED) {
        throw new UnChangeableException("Cannot modify a validated or expired ticket.");
    }

    // 2. Apply changes
    if (updateRequest.getSeatcode() != null) {
        ticket.setSeatcode(updateRequest.getSeatcode());
    }
    if (updateRequest.getTripId() != ticket.getTripId()) { 
        ticket.setTripId(updateRequest.getTripId());
    }

    // 3. Update status and timestamp
    ticket.setStatus(TicketStatus.CHANGED);
    ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

    // 4. Save and return
    Ticket updatedTicket = repo.save(ticket);

    // Optionally log in TicketHistoryService
    // ticketHistoryService.logChange(ticket, TicketStatus.CHANGED, "USER");

    return TicketMapper.toDto(updatedTicket);
}
/**
     * @param ticketId        The ticket that will be aborted
 */
// abort the ticket 
public TicketResponseDTO abortTicket(Long ticketId) {
    Ticket ticket = repo.findById(ticketId)
                        .orElseThrow(() -> new TicketNotFoundException(ticketId));

    // 1. Check if cancellation is possible
    if (ticket.getStatus() == TicketStatus.VALIDATED || ticket.getStatus() == TicketStatus.EXPIRED) {
        throw new UnChangeableException("Cannot cancel a validated or expired ticket.");
    }

    // 2. Update status and timestamp
    ticket.setStatus(TicketStatus.CANCELLED);
    ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

    // 3. Save to DB
    Ticket cancelledTicket = repo.save(ticket);

    // Optionally notify PaymentService for refund (via Kafka)
    // paymentProducer.sendRefundRequest(ticket.getId(), ticket.getPrice());

    // log change

    ticketHistoryService.logChange(ticket.getId(),ticket.getStatus(), TicketStatus.CANCELLED, "USER");

    // 4. Return DTO
    return TicketMapper.toDto(cancelledTicket);
}


}
