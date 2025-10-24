package ma.ensias.soa.ticketservice.mapper;

import org.springframework.stereotype.Component;

import ma.ensias.soa.ticketservice.dto.TicketHistoryDTO;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.entity.TicketHistory;
@Component
public class TicketHistoryMapper {

    public TicketHistory toEntity(TicketHistoryDTO dto) {
        if (dto == null) return null;

        return TicketHistory.builder()
                .previousStatus(dto.getPreviousStatus())
                .newStatus(dto.getNewStatus())
                .changedAt(dto.getChangedAt())
                .changedBy(dto.getChangedBy())
                .ticket(Ticket.builder().id(dto.getTicketId()).build()) 
                .archived(false)
                .build();
    }

    public TicketHistoryDTO toDto(TicketHistory entity) {
        if (entity == null) return null;

        TicketHistoryDTO dto = new TicketHistoryDTO();
        dto.setId(entity.getId());
        dto.setTicketId(entity.getTicket().getId()); 
        dto.setPreviousStatus(entity.getPreviousStatus());
        dto.setNewStatus(entity.getNewStatus());
        dto.setChangedAt(entity.getChangedAt());
        dto.setChangedBy(entity.getChangedBy());
        return dto;
    }
}

