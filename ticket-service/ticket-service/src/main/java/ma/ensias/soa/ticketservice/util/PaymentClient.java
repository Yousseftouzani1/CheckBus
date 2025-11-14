package ma.ensias.soa.ticketservice.util;

import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.PaymentRequestDTO;
import ma.ensias.soa.ticketservice.dto.PaymentResponseDTO;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;

@Component
@RequiredArgsConstructor
public class PaymentClient {
    private final RestTemplate restTemplate;
    // payement process of a ticket 
    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        // The URL of  PaymentService TO CHANGE FOR DOCKER et kubernetes par la suite 
        String url = "http://payment-service:8085/api/payments/process";
        // Send POST request to PaymentService
        try {
            return restTemplate.postForObject(url, request, PaymentResponseDTO.class);
            } catch (RestClientException e) {
            System.err.println("Payment service unavailable: " + e.getMessage());
            return new PaymentResponseDTO(null, PaymentStatus.FAILED, "Payment service unreachable");
            }
    }
}
