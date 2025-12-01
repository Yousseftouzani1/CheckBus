package ma.ensias.soa.notification_service.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Service
public class NotificationEmitterService {

    // userId → emitter
    private final Map<Long, SseEmitter> emitters = new ConcurrentHashMap<>();

    public SseEmitter createEmitter(Long userId) {
        SseEmitter emitter = new SseEmitter(0L); // infinite timeout
        emitters.put(userId, emitter);

        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));
        emitter.onError(e -> emitters.remove(userId));

        log.info("🔌 SSE connection established for user {}", userId);

        return emitter;
    }

    public void sendNotification(Long userId, Object data) {
        SseEmitter emitter = emitters.get(userId);
        if (emitter == null) return;

        try {
            emitter.send(SseEmitter.event()
                    .name("notification")
                    .data(data));

            log.info("📤 Real-time notification sent to user {}", userId);

        } catch (IOException e) {
            log.warn("⚠️ Failed to push SSE notification, removing emitter for user {}", userId);
            emitters.remove(userId);
        }
    }
}
