package ma.ensias.soa.subscription_service.client;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.subscription_service.dto.PaymentRequestDTO;
import ma.ensias.soa.subscription_service.dto.PaymentResponseDTO;


/**
 * The `PaymentClient` class is a Spring component used for processing payments by sending a POST
 * request to a payment service URL using RestTemplate.
 */
@Component
@RequiredArgsConstructor
public class PaymentClient {

    private final RestTemplate restTemplate;
    private final  String paymentServiceUrl="http://payment-service:8085/api/payments/process";

    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        String url = paymentServiceUrl ;
        ResponseEntity<PaymentResponseDTO> response =
                restTemplate.postForEntity(url, request, PaymentResponseDTO.class);
        return response.getBody();
    }
}