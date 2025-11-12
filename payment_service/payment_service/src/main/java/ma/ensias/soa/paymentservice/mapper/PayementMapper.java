package ma.ensias.soa.paymentservice.mapper;

import org.springframework.stereotype.Component;

import ma.ensias.soa.paymentservice.dto.PaymentRequestDTO;
import ma.ensias.soa.paymentservice.dto.PaymentResponseDTO;
import ma.ensias.soa.paymentservice.entity.Payment;

@Component
public class PayementMapper {
// request ---------> entity
public Payment toEntity(PaymentRequestDTO dto){
    return Payment.builder()
    .amount(dto.getAmount())
    .createdAt(dto.getCreatedAt())
    .amount(dto.getAmount())
    .method(dto.getMethod())
    .ticketId(dto.getTicketId())
    .build();
}
// entity -----> response
public PaymentResponseDTO toDto(Payment payment){
    PaymentResponseDTO response = new PaymentResponseDTO();
    response.setMessage("The state is "+ payment.getStatus()+" for the ticket : "+payment.getTicketId());
    response.setPaymentReference(payment.getPaymentReference());
    response.setStatus(payment.getStatus());
    return response;
}
}
