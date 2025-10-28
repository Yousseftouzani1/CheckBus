package ma.ensias.soa.ticketservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.service.TicketHistoryService;
import ma.ensias.soa.ticketservice.dto.TicketHistoryDTO;

@RestController
@RequestMapping("/api/ticket-history")
@RequiredArgsConstructor
public class TicketHistoryController {

    private final TicketHistoryService ticketHistoryService;

    @GetMapping("/{ticketId}")
    public ResponseEntity<List<TicketHistoryDTO>> getHistoryByTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketHistoryService.getHistoryByTicketId(ticketId));
    }
}

