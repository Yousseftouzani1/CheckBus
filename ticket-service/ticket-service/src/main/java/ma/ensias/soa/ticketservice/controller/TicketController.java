package ma.ensias.soa.ticketservice.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.TicketRequestDTO;
import ma.ensias.soa.ticketservice.dto.TicketResponseDTO;
import ma.ensias.soa.ticketservice.service.TicketService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/tickets")
public class TicketController {

    private final TicketService ticketService;

@PostMapping("/reserve")
    public ResponseEntity<TicketResponseDTO> reserveTicket(@RequestBody TicketRequestDTO ticketRequest){
    return ResponseEntity.ok(ticketService.reserveTicket(ticketRequest));
    }
@PostMapping("/{ticketId}/buy")
public ResponseEntity<TicketResponseDTO> buyTicket(
        @PathVariable Long ticketId,
        @RequestParam(defaultValue = "CARD") String method) {
    return ResponseEntity.ok(ticketService.buyTicket(ticketId, method));
}

@PutMapping("/{ticketId}/change")
    public ResponseEntity<TicketResponseDTO> changeTicket(@PathVariable Long ticketId, @RequestBody TicketRequestDTO updateDto) {
        return ResponseEntity.ok(ticketService.changeTicket(ticketId, updateDto));
    }

@DeleteMapping("/{ticketId}/cancel")
    public ResponseEntity<TicketResponseDTO> cancelTicket(@PathVariable Long ticketId) {
        return ResponseEntity.ok(ticketService.abortTicket(ticketId));
    }
@GetMapping("/user/{userId}")
    public ResponseEntity<List<TicketResponseDTO>> getTicketsByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ticketService.getTicketsByUserId(userId));
    }





















}
