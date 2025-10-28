package ma.ensias.soa.ticketservice.kafka;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.TicketExpirationEvent;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TicketExpirationProducer {

    private final KafkaTemplate<String, TicketExpirationEvent> kafkaTemplate;

    public void sendExpirationEvent(TicketExpirationEvent event) {
        kafkaTemplate.send("ticket-expiration-topic", event);
        System.out.println("Ticket expiration event published: " + event);
    }
}
