package ma.ensias.soa.ticketservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.service.PaymentInfoService;
import ma.ensias.soa.ticketservice.dto.PaymentInfoDTO;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
public class PaymentInfoController {

    private final PaymentInfoService paymentInfoService;

    @GetMapping("/ticket/{ticketId}")
    public ResponseEntity<List<PaymentInfoDTO>> getPaymentsByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(paymentInfoService.getPaymentsByTicket(ticketId));
    }

    @GetMapping("/successful")
    public ResponseEntity<List<PaymentInfoDTO>> getSuccessfulPayments() {
        return ResponseEntity.ok(paymentInfoService.getSuccessfulPayments());
    }
}

