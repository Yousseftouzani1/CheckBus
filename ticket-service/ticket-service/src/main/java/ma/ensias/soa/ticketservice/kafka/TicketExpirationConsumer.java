package ma.ensias.soa.ticketservice.kafka;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.TicketExpirationEvent;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.enums.TicketStatus;
import ma.ensias.soa.ticketservice.repository.TicketRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import java.sql.Timestamp;

@Service
@RequiredArgsConstructor
public class TicketExpirationConsumer {

    private final TicketRepository ticketRepository;

    @KafkaListener(topics = "ticket-expiration-topic", groupId = "ticket-expiration-group",containerFactory = "expirationKafkaListenerContainerFactory")
    public void handleExpirationEvent(TicketExpirationEvent event) {
        System.out.println("Processing expiration event for ticket: " + event.getTicketId());

        Ticket ticket = ticketRepository.findById(event.getTicketId()).orElse(null);
        if (ticket == null) return;

        // Check if ticket is still unpaid
        if (ticket.getStatus() == TicketStatus.RESERVED) {
            //ticket.setStatus(TicketStatus.FREE);
            ticket.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
            ticketRepository.save(ticket);

            System.out.println(" Ticket ID " + event.getTicketId() + " expired and cancelled.");
        } else {
            if(ticket.getStatus() == TicketStatus.PAID){
            System.out.println("Ticket ID " + event.getTicketId() + " already paid — skipping expiration.");
            }
            if(ticket.getStatus() == TicketStatus.EXPIRED){
            System.out.println("Ticket ID " + event.getTicketId() + " already expired .");

            }
        }
    }
}
