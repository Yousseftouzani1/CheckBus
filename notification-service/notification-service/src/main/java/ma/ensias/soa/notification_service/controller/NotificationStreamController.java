package ma.ensias.soa.notification_service.controller;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.notification_service.service.NotificationEmitterService;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationStreamController {

    private final NotificationEmitterService emitterService;

    @GetMapping("/stream/{userId}")
    public SseEmitter stream(@PathVariable Long userId) {
        return emitterService.createEmitter(userId);
    }
}
