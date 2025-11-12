package ma.ensias.soa.ticketservice.kafka;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.PaymentEventDTO;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;
import ma.ensias.soa.ticketservice.service.TicketService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PaymentEventListener {

    private final TicketService ticketService;

    @KafkaListener(topics = "payment-status-topic", groupId = "ticket-service-group")
    public void handlePaymentEvent(PaymentEventDTO event) {
        System.out.println("📥 Received PaymentEventDTO: " + event);
        
        if (event.getStatus() == PaymentStatus.REFUNDED) {
            ticketService.handleRefundConfirmation(event);
        }// else {
        //     ticketService.updateTicketStatusBasedOnPayment(event);
        // }
    }
}
