package ma.ensias.soa.geoloc_service.controller;

import lombok.extern.slf4j.Slf4j;
import ma.ensias.soa.geoloc_service.dto.BusPositionRequestDTO;
import ma.ensias.soa.geoloc_service.dto.BusPositionResponseDTO;
import ma.ensias.soa.geoloc_service.service.BusPositionService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@Slf4j
public class GeoSocketController {

    private final BusPositionService positionService;

    public GeoSocketController(BusPositionService positionService) {
        this.positionService = positionService;
    }

    @MessageMapping("/bus/update")
    @SendTo("/topic/bus/positions")
    public BusPositionResponseDTO updateBusPosition(BusPositionRequestDTO request) {
        log.info("📡 STOMP update received for bus {}", request.getBusId());
        return positionService.saveOrUpdatePosition(request);
    }
}
