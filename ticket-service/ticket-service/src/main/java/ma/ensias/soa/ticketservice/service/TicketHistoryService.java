package ma.ensias.soa.ticketservice.service;

import java.sql.Timestamp;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.TicketHistoryDTO;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.entity.TicketHistory;
import ma.ensias.soa.ticketservice.enums.TicketStatus;
import ma.ensias.soa.ticketservice.exception.TicketNotFoundException;
import ma.ensias.soa.ticketservice.mapper.TicketHistoryMapper;
import ma.ensias.soa.ticketservice.repository.TicketHistoryRepository;
import ma.ensias.soa.ticketservice.repository.TicketRepository;

@Service
@RequiredArgsConstructor
@Transactional
public class TicketHistoryService {

    private final TicketHistoryRepository historyRepository;
    private final TicketRepository ticketRepository;
    private final TicketHistoryMapper historyMapper;

    /**
     * Log a ticket status change (RESERVED → PAID, PAID → CANCELLED, etc.)
     *
     * @param ticketId        The ticket that will be changed 
     * @param previousStatus  The old ticket status 
     * @param newStatus       The new ticket status
     * @param changedBy       Who changed this  (USER, SYSTEM, PAYMENT_SERVICE)
     * @return TickethistoryDto 
     */
    public TicketHistoryDTO logChange(Long ticketId, TicketStatus previousStatus, TicketStatus newStatus, String changedBy) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        TicketHistory history = TicketHistory.builder()
                .ticket(ticket)
                .previousStatus(previousStatus)
                .newStatus(newStatus)
                .changedAt(new Timestamp(System.currentTimeMillis()))
                .changedBy(changedBy)
                .archived(false)
                .build();

        TicketHistory saved = historyRepository.save(history);
        return historyMapper.toDto(saved);
    }

    /**
     * Retrieve all history records for a  ticket.
     *
     * @param ticketId The ticket Id
     * @return List of TicketHistoryDTO
     */
    public List<TicketHistoryDTO> getHistoryByTicketId(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        List<TicketHistory> histories = historyRepository.findByTicket(ticket);
        return histories.stream()
                        .map(historyMapper::toDto)
                        .collect(Collectors.toList());
    }

    /**
     *  Archive all history entries for a ticket (mark as archived).
     *
     * @param ticketId The ticket ID
     */
    public void archiveHistory(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
                .orElseThrow(() -> new TicketNotFoundException(ticketId));

        List<TicketHistory> histories = historyRepository.findByTicket(ticket);
        histories.forEach(h -> h.setArchived(true));
        historyRepository.saveAll(histories);
    }
}

