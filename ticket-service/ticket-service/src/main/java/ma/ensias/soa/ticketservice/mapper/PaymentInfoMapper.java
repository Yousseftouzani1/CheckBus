package ma.ensias.soa.ticketservice.mapper;

import org.springframework.stereotype.Component;
import ma.ensias.soa.ticketservice.dto.PaymentEventDTO;
import ma.ensias.soa.ticketservice.dto.PaymentInfoDTO;
import ma.ensias.soa.ticketservice.entity.PaymentInfo;
import ma.ensias.soa.ticketservice.entity.Ticket;

@Component
public class PaymentInfoMapper {

// request ---------> entity
public PaymentInfo toEntity(PaymentEventDTO dto){
    if( dto == null ) return null;
return PaymentInfo.builder()
    .paymentReference(dto.getPaymentReference())
    .price(dto.getAmount())
    .confirmedAt(dto.getConfirmedAt())
    .ticket(Ticket.builder().id(dto.getTicketId()).build())
    .status(dto.getStatus())
    .build();

    
}
 
// entity -----> response

public PaymentInfoDTO toDto(PaymentInfo entity) {
    if (entity == null) return null;

    PaymentInfoDTO dto = new PaymentInfoDTO();
    
    dto.setTicketId(entity.getTicket().getId());
    dto.setPaymentReference(entity.getPaymentReference());
    dto.setPrice(entity.getPrice());
    dto.setStatus(entity.getStatus());
    dto.setConfirmedAt(entity.getConfirmedAt());

    return dto;
}


}
