package ma.ensias.soa.ticketservice.mapper;

import org.springframework.stereotype.Component;

import ma.ensias.soa.ticketservice.dto.TicketRequestDTO;
import ma.ensias.soa.ticketservice.dto.TicketResponseDTO;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.enums.TicketStatus;
@Component
public class TicketMapper {

    //  request -----------> entity
public Ticket toEntity(TicketRequestDTO dto){
    return Ticket.builder()
                    .userId(dto.getUserId())
                    .price(dto.getPrice())
                    .seatcode(dto.getSeatcode())
                    .tripId(dto.getTripId())
                    .status(TicketStatus.RESERVED)
                    .build();
}

//        entity ------------> response dto
public TicketResponseDTO toDto(Ticket entity) {
    if (entity == null) return null;

    TicketResponseDTO dto = new TicketResponseDTO();
    dto.setId(entity.getId());
    dto.setUserId(entity.getUserId());
    dto.setTripId(entity.getTripId());
    dto.setSeatcode(entity.getSeatcode()); 
    dto.setPrice(entity.getPrice());
    dto.setStatus(entity.getStatus());
    dto.setQrCode(entity.getQr_code());      
    dto.setCreatedAt(entity.getCreatedAt());
    dto.setUpdatedAt(entity.getUpdatedAt());

    return dto;
}


}
