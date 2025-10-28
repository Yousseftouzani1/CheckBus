package ma.ensias.soa.paymentservice.kafka;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.paymentservice.dto.RefundRequestDTO;
import ma.ensias.soa.paymentservice.service.PaymentService;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RefundConsumer {

    private final PaymentService paymentService;

    @KafkaListener(topics = "refund-request-topic", groupId = "payment-service-group")
    public void consumeRefundRequest(RefundRequestDTO refundRequest) {
        System.out.println(" Received refund request: " + refundRequest);
        paymentService.processRefund(refundRequest);
    }
}
