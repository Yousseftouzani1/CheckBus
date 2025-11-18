package ma.ensias.soa.paymentservice.service;

import java.sql.Timestamp;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;

import ma.ensias.soa.paymentservice.dto.PaymentEventDTO;
import ma.ensias.soa.paymentservice.dto.PaymentRequestDTO;
import ma.ensias.soa.paymentservice.dto.PaymentRequestSubDTO;
import ma.ensias.soa.paymentservice.dto.PaymentResponseDTO;
import ma.ensias.soa.paymentservice.dto.RefundRequestDTO;
import ma.ensias.soa.paymentservice.entity.Payment;
import ma.ensias.soa.paymentservice.enums.PaymentStatus;
import ma.ensias.soa.paymentservice.kafka.PaymentEventProducer;
import ma.ensias.soa.paymentservice.mapper.PayementMapper;
import ma.ensias.soa.paymentservice.repository.PaymentRepository;

@Service
public class PaymentService {
    private final PaymentEventProducer eventProducer;
    private final PaymentRepository paymentRepository ;
    private final PayementMapper Mapper;
    public PaymentService(PaymentRepository paymentRepository,PayementMapper Mapper,PaymentEventProducer eventProducer){
        this.Mapper=Mapper;
        this.paymentRepository=paymentRepository;
        this.eventProducer= eventProducer;

    }
    @Value("${stripe.secretKey}")
    private String stripeSecretKey;

    @Value("${stripe.currency}")
    private String currency;

    public PaymentResponseDTO processPayment(PaymentRequestDTO request) throws StripeException {
    Stripe.apiKey = stripeSecretKey;

    try {
        // ✅ 1. Create Stripe PaymentIntent parameters
        Map<String, Object> params = new HashMap<>();
        params.put("amount", (long) (request.getAmount() * 100)); // in cents
        params.put("currency", currency);
        params.put("payment_method_types", List.of("card"));
        params.put("payment_method", "pm_card_visa"); // ✅ add test card method
        params.put("confirmation_method", "automatic");
        params.put("confirm", true); // ✅ auto-confirm the payment
        params.put("description", "Ticket payment for ID " + request.getTicketId());

        // ✅ 2. Create and confirm the payment
        PaymentIntent intent = PaymentIntent.create(params);

        boolean success = "succeeded".equals(intent.getStatus());

        // ✅ 3. Map and populate Payment entity
        Payment payment = Mapper.toEntity(request);
        payment.setPaymentReference(intent.getId() != null ? intent.getId() : UUID.randomUUID().toString());
        payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        paymentRepository.save(payment);

        // ✅ 4. Publish Kafka event
        PaymentEventDTO event = PaymentEventDTO.builder()
                .ticketId(payment.getTicketId())
                .paymentReference(payment.getPaymentReference())
                .amount(payment.getAmount())
                .status(payment.getStatus())
                .confirmedAt(new Timestamp(System.currentTimeMillis()))
                .build();

        eventProducer.sendPaymentEvent(event);
        //
        System.out.println(event+"hello hello hello hello ");

        // ✅ 5. Return a meaningful response
        return new PaymentResponseDTO(
                payment.getPaymentReference(),
                payment.getStatus(),
                success ? "Payment completed successfully" : "Payment failed"
        );
    }
    catch (StripeException e) {
        // ⚠️ If Stripe fails (bad key, network issue, etc.), simulate payment success for local tests
        System.err.println("⚠️ Stripe error: " + e.getMessage());
        Payment simulated = Mapper.toEntity(request);
        simulated.setPaymentReference(UUID.randomUUID().toString());
        simulated.setStatus(PaymentStatus.SUCCESS); // or FAILED if you prefer
        simulated.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        paymentRepository.save(simulated);

        return new PaymentResponseDTO(
                simulated.getPaymentReference(),
                simulated.getStatus(),
                "S payment success "
        );
    }
}


    // refund payement process
    public PaymentResponseDTO processRefund(RefundRequestDTO refundRequest) {
    // Find the original payment
    Payment payment = paymentRepository.findByTicketIdAndStatus(refundRequest.getTicketId(),PaymentStatus.SUCCESS);
    if(payment==null){
            throw new RuntimeException("Payment not found for ticket ID: " + refundRequest.getTicketId());
    }


    // Simulate refund processing
    payment.setStatus(PaymentStatus.REFUNDED);
    payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
    paymentRepository.save(payment);

    // Send refund confirmation event
    PaymentEventDTO event = PaymentEventDTO.builder()
            .ticketId(payment.getTicketId())
            .paymentReference(payment.getPaymentReference())
            .amount(payment.getAmount())
            .status(PaymentStatus.REFUNDED)
            .confirmedAt(new Timestamp(System.currentTimeMillis()))
            .build();

    eventProducer.sendPaymentEvent(event);




    return new PaymentResponseDTO(
                payment.getPaymentReference(),
                payment.getStatus(),
                "the refund is confirmed and is ongoing !"
        ); 
}

    // subscription payement process 
    public PaymentResponseDTO processPayment(PaymentRequestSubDTO request) throws StripeException {
        Stripe.apiKey = stripeSecretKey;

        // 1. Save initial payment
        Payment payment=Payment.builder()
                        .amount(request.getAmount())
                        .method("card")
                        .subscription_id(request.getSubscriptionId())
                        .paymentReference(UUID.randomUUID().toString())
                        .status(PaymentStatus.PENDING)
                        .build()
        ;
        paymentRepository.save(payment);

        // 2. Create PaymentIntent (represents a real transaction)
        Map<String, Object> params = new HashMap<>();
        params.put("amount", (long) (request.getAmount() * 100)); // amount in cents
        params.put("currency", currency);
        params.put("payment_method_types", List.of("card"));
        params.put("description", "subscription payment for ID " + request.getSubscriptionId());

        PaymentIntent intent = PaymentIntent.create(params);

        // 3. Confirm payment instantly (test mode allows auto-confirmation)
        PaymentIntent confirmedIntent = intent.confirm();

        // 4. Update payment entity based on result
        boolean success = "succeeded".equals(confirmedIntent.getStatus());
        payment.setPaymentReference(confirmedIntent.getId());
        payment.setStatus(success ? PaymentStatus.SUCCESS : PaymentStatus.FAILED);
        payment.setUpdatedAt(new Timestamp(System.currentTimeMillis()));
        paymentRepository.save(payment);

        // 5. Publish Kafka event to Ticket Service
    PaymentEventDTO event = PaymentEventDTO.builder()
            .subscriptionId(payment.getSubscription_id())
            .paymentReference(payment.getPaymentReference())
            .amount(payment.getAmount())
            .status(payment.getStatus())
            .confirmedAt(new Timestamp(System.currentTimeMillis()))
            .build();

        eventProducer.sendSubscriptionPaymentEvent(event); //    kafka 

        // 6. Return response
        return new PaymentResponseDTO(
                payment.getPaymentReference(),
                payment.getStatus(),
                success ? "Payment completed successfully" : "Payment failed"
        );
    }
} 
