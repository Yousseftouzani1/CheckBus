package ma.ensias.soa.notification_service.controller;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.notification_service.service.NotificationEmitterService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000") // ✔ Enable CORS for all endpoints
public class NotificationStreamController {

    private final NotificationEmitterService emitterService;

    @CrossOrigin(origins = "http://localhost:3000") // ✔ Required explicitly for SSE
    @GetMapping(value = "/stream/{userId}", produces = "text/event-stream")
    public SseEmitter stream(@PathVariable Long userId) {
        return emitterService.createEmitter(userId); // ✔ keep your method
    }
}
