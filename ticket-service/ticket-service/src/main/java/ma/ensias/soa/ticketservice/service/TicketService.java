package ma.ensias.soa.ticketservice.service;

import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Service;

import ma.ensias.soa.ticketservice.dto.PaymentEventDTO;
import ma.ensias.soa.ticketservice.dto.PaymentRequestDTO;
import ma.ensias.soa.ticketservice.dto.PaymentResponseDTO;
import ma.ensias.soa.ticketservice.dto.RefundRequestDTO;
import ma.ensias.soa.ticketservice.dto.TicketExpirationEvent;
import ma.ensias.soa.ticketservice.dto.TicketRequestDTO;
import ma.ensias.soa.ticketservice.dto.TicketResponseDTO;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;
import ma.ensias.soa.ticketservice.enums.TicketStatus;
import ma.ensias.soa.ticketservice.exception.NoSeatsAvailableException;
import ma.ensias.soa.ticketservice.exception.OccupiedSeatException;
import ma.ensias.soa.ticketservice.exception.TicketNotFoundException;
import ma.ensias.soa.ticketservice.exception.UnChangeableException;
import ma.ensias.soa.ticketservice.kafka.RefundProducer;
import ma.ensias.soa.ticketservice.kafka.TicketExpirationProducer;
import ma.ensias.soa.ticketservice.mapper.TicketMapper;
import ma.ensias.soa.ticketservice.repository.TicketRepository;
import ma.ensias.soa.ticketservice.util.PaymentClient;

@Service
public class TicketService {

        private final TicketRepository repo;
        private final TicketMapper TicketMapper;
        private final TicketHistoryService ticketHistoryService ;
        private final PaymentClient paymentClient;
        private  RefundProducer refundProducer;
        private  TicketExpirationProducer ticketExpirationProducer;
    public TicketService(TicketRepository repo,TicketMapper TicketMapper,TicketHistoryService ticketHistoryService,PaymentClient paymentClient,RefundProducer refundProducer,TicketExpirationProducer ticketExpirationProducer){
        this.repo=repo;
        this.TicketMapper=TicketMapper;
        this.ticketHistoryService= ticketHistoryService;
        this.paymentClient=paymentClient;
        this.refundProducer=refundProducer;
        this.ticketExpirationProducer =ticketExpirationProducer;
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

    // 2. Verify seat availability       // or call trajet service 
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
// 5. Publish delayed expiration event using Kafka
long delayMillis = 15 * 60 * 1000; // 15 minutes
TicketExpirationEvent event = new TicketExpirationEvent(
        savedTicket.getId(),
        System.currentTimeMillis() + delayMillis
);
ticketExpirationProducer.sendExpirationEvent(event);
    

    // 5. Return DTO
    return TicketMapper.toDto(savedTicket);
}



/*
ticket service -------PaymentRequestDTO--------------> payment service
payment service ------------PaymentResponseDTO--------->ticket service      via rest call
 */
public TicketResponseDTO buyTicket(Long ticketId, String method) {
        //  Fetch the ticket
        Ticket ticket = repo.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        //  Prepare payment request
        PaymentRequestDTO paymentRequest = PaymentRequestDTO.builder()
                .ticketId(ticket.getId())
                .amount(ticket.getPrice())
                .method(method)
                .createdAt(new Timestamp(System.currentTimeMillis()))
                .build();

        //  Call PaymentService via REST
        PaymentResponseDTO response = paymentClient.processPayment(paymentRequest);

        //  Update ticket status based on payment result
        if (response.getStatus() == PaymentStatus.SUCCESS) {
            ticket.setStatus(TicketStatus.PAID);
        } else {
            ticket.setStatus(TicketStatus.FREE);
        }

        ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        Ticket saved = repo.save(ticket);

        //  Log the change for  the entity history of payements 
        ticketHistoryService.logChange(ticket.getId(), TicketStatus.RESERVED, ticket.getStatus(), "SYSTEM");

        return TicketMapper.toDto(saved);
    }


/**
     * @param ticketId The ticket that will be aborted
     * @param updateRequest  TicketRequestDTO demand the cancelation of the ticket it s the same dto used before 
 */
// change a ticket with the same price 
public TicketResponseDTO changeTicket(Long ticketId, TicketRequestDTO updateRequest) {
    Ticket ticket = repo.findById(ticketId)
                        .orElseThrow(() -> new TicketNotFoundException(ticketId));
    TicketStatus oldStatus = ticket.getStatus();
    // 1. Check if modification is allowed
    if (ticket.getStatus() == TicketStatus.VALIDATED || ticket.getStatus() == TicketStatus.EXPIRED) {
        throw new UnChangeableException("Cannot modify a validated or expired ticket.");
    }
    // check if the seat wanted is available on the trip
    Ticket ticket_check=repo.findByTripIdAndSeatcode(updateRequest.getTripId(),updateRequest.getSeatcode());
    if(ticket_check.getStatus()!=TicketStatus.FREE){
            throw new OccupiedSeatException();
    }
    // 2. Apply changes
    if (!updateRequest.getSeatcode().equals(ticket.getSeatcode())) {
        ticket.setSeatcode(updateRequest.getSeatcode());
    }
    if (!updateRequest.getTripId().equals(ticket.getTripId())) { 
        ticket.setTripId(updateRequest.getTripId());
    }
    // 3. Update status and timestamp
    ticket.setStatus(TicketStatus.CHANGED);
    ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

    // 4. Save and return
    Ticket updatedTicket = repo.save(ticket);

    //  log in TicketHistory db 
    ticketHistoryService.logChange(ticket.getId(),oldStatus, TicketStatus.CHANGED, "USER");

    return TicketMapper.toDto(updatedTicket);
}


/**
     * @param ticketId        The ticket that will be aborted
 */

// abort the ticket 

public TicketResponseDTO abortTicket(Long ticketId) {
    Ticket ticket = repo.findById(ticketId)
                        .orElseThrow(() -> new TicketNotFoundException(ticketId));

    // Check if cancellation is possible

    if (ticket.getStatus() == TicketStatus.VALIDATED || ticket.getStatus() == TicketStatus.EXPIRED) {
        throw new UnChangeableException("Cannot cancel a validated or expired ticket.");
    }
    TicketStatus oldStatus = ticket.getStatus();

    // Update status and timestamp

    ticket.setStatus(TicketStatus.CANCELLED);
    ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));

    // Save to DB
    Ticket cancelledTicket = repo.save(ticket);

    /*
    ticket service --------- produces refund request -------> kafka
    kafka <---------- consume refund request <-------- payement service
    */ 
    
    // notify PaymentService for refund via Kafka

    if (oldStatus == TicketStatus.PAID) {
        RefundRequestDTO refund = RefundRequestDTO.builder()
                .ticketId(ticket.getId())
                .amount(ticket.getPrice())
                
                .build();

        refundProducer.sendRefundRequest(refund);
    }
    // log change

    ticketHistoryService.logChange(ticket.getId(),ticket.getStatus(), TicketStatus.CANCELLED, "USER");

    // 4. Return DTO
    return TicketMapper.toDto(cancelledTicket);
}

public void handleRefundConfirmation(PaymentEventDTO event) {
    Ticket ticket = repo.findById(event.getTicketId())
            .orElseThrow(() -> new TicketNotFoundException(event.getTicketId()));

    TicketStatus oldStatus = ticket.getStatus();
    ticket.setStatus(TicketStatus.CANCELLED);
    ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
    repo.save(ticket);

    ticketHistoryService.logChange(ticket.getId(), oldStatus, TicketStatus.CANCELLED, "SYSTEM");
    System.out.println("Refund confirmed for ticket ID: " + event.getTicketId());
}

}
