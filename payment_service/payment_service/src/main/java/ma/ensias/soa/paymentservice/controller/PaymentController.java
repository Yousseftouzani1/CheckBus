package ma.ensias.soa.paymentservice.controller;


import lombok.RequiredArgsConstructor;
import ma.ensias.soa.paymentservice.dto.PaymentRequestDTO;
import ma.ensias.soa.paymentservice.dto.PaymentResponseDTO;
import ma.ensias.soa.paymentservice.entity.Payment;
import ma.ensias.soa.paymentservice.enums.PaymentStatus;
import ma.ensias.soa.paymentservice.service.PaymentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.stripe.exception.StripeException;

import java.util.List;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    /**
     *  Initiate a new payment for a ticket
     * Called by frontend or TicketService
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
     * Get all payments (optional admin route)
     */
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    /**
     * Get all payments for a specific ticket
     */
    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<Payment>> getPaymentsByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(paymentService.getPaymentsByTicket(ticketId));
    }

    /**
     *  Check payment status by reference
     */
    @GetMapping("/status/{reference}")
    public ResponseEntity<Payment> getPaymentByReference(@PathVariable String reference) {
        return ResponseEntity.ok(paymentService.getPaymentByReference(reference));
    }

    /**
     *  Trigger a refund (optional)
     */
    @PostMapping("/refund/{reference}")
    public ResponseEntity<PaymentResponseDTO> refundPayment(@PathVariable String reference) {
        PaymentResponseDTO response = paymentService.refundPayment(reference);
        return ResponseEntity.ok(response);
    }
}
