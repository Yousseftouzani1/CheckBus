package ma.ensias.soa.geoloc_service.controller;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.geoloc_service.dto.BusPositionRequestDTO;
import ma.ensias.soa.geoloc_service.dto.BusPositionResponseDTO;
import ma.ensias.soa.geoloc_service.service.BusPositionService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * Handles real-time bus position updates via WebSocket.
 */
@Controller
@RequiredArgsConstructor
@Slf4j
public class GeoSocketController {

    private final BusPositionService positionService;

    /**
     * Receives position updates from connected buses.
     * Clients send messages to /app/bus/update
     * The server broadcasts to /topic/bus-position
     */
    @MessageMapping("/bus/update")
    @SendTo("/topic/bus-position")
    public BusPositionResponseDTO receiveBusPosition(BusPositionRequestDTO request) {
        log.info("WebSocket position received for bus {}", request.getBusId());
        return positionService.saveOrUpdatePosition(request);
    }
}
