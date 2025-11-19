package ma.ensias.soa.paymentservice.controller;


import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.stripe.exception.StripeException;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.paymentservice.dto.PaymentRequestDTO;
import ma.ensias.soa.paymentservice.dto.PaymentRequestSubDTO;
import ma.ensias.soa.paymentservice.dto.PaymentResponseDTO;
import ma.ensias.soa.paymentservice.dto.RefundRequestDTO;
import ma.ensias.soa.paymentservice.entity.Payment;
import ma.ensias.soa.paymentservice.enums.PaymentStatus;
import ma.ensias.soa.paymentservice.service.PaymentService;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     *  Initiate a new payment for a ticket
     *  Called by frontend or TicketService
     */
    @PostMapping("/process")
    public ResponseEntity<PaymentResponseDTO> process(@RequestBody PaymentRequestDTO request) {
        try {
            PaymentResponseDTO response = paymentService.processPayment(request);
            return ResponseEntity.ok(response);
        } catch (StripeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(new PaymentResponseDTO(null, PaymentStatus.FAILED, e.getMessage()));
        }
    }
    

    /**
     *  Trigger a refund 
     * called by the ticket service or front end 
     */
    @PostMapping("/refund")
    public ResponseEntity<PaymentResponseDTO> refundPayment(@RequestBody RefundRequestDTO reference) {
        PaymentResponseDTO response = paymentService.processRefund(reference);
        return ResponseEntity.ok(response);
    }

    /**
     * 
        Triggers the payement of the subscription 
        called by the subscription service or frontend 
     */

    @PostMapping("/subscribe")
    public ResponseEntity<PaymentResponseDTO> processSub(@RequestBody PaymentRequestSubDTO subscription) throws StripeException{
        PaymentResponseDTO response = paymentService.processPayment(subscription);
        return ResponseEntity.ok(response);
    }



        @GetMapping("/ticket/{ticketId}")
    public List<Payment> getPaymentsByTicket(@PathVariable Long ticketId) {
        return paymentService.getPaymentsByTicketId(ticketId);
    }

    // ✅ Get all successful payments
    @GetMapping("/successful")
    public List<Payment> getSuccessfulPayments() {
        return paymentService.getSuccessfulPayments();
    }
}
