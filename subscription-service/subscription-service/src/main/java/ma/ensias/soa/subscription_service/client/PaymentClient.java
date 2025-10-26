package ma.ensias.soa.subscription_service.client;

import ma.ensias.soa.subscription_service.dto.PaymentRequestDTO;
import ma.ensias.soa.subscription_service.dto.PaymentResponseDTO;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component
@RequiredArgsConstructor
public class PaymentClient {

    private final RestTemplate restTemplate;

    @Value("${payment.service.url}")
    private String paymentServiceUrl;

    public PaymentResponseDTO processPayment(PaymentRequestDTO request) {
        String url = paymentServiceUrl + "/payments/charge";
        ResponseEntity<PaymentResponseDTO> response =
                restTemplate.postForEntity(url, request, PaymentResponseDTO.class);
        return response.getBody();
    }
}