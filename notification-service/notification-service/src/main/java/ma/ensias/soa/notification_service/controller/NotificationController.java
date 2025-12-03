package ma.ensias.soa.notification_service.controller;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.notification_service.dto.api.NotificationFilterDTO;
import ma.ensias.soa.notification_service.dto.api.NotificationResponse;
import ma.ensias.soa.notification_service.enums.NotificationType;
import ma.ensias.soa.notification_service.service.NotificationService;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.format.annotation.DateTimeFormat;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    // 🔥 1. Fetch all notifications for a user

    @GetMapping("/user/{userId}")
    public Page<NotificationResponse> getUserNotifications(
            @PathVariable Long userId,
            NotificationFilterDTO filter) {
        return notificationService.getNotifications(
                userId,
                filter.getPage(),
                filter.getSize(),
                filter.getSeen(),
                filter.getType(),
                filter.getFrom(),
                filter.getTo());
    }

    // 🔥 2. Count unread notifications for a user
    @GetMapping("/user/{userId}/unread-count")
    public Long countUnread(@PathVariable Long userId) {
        return notificationService.countUnread(userId);
    }

    // 🔥 3. Mark a single notification as seen
    @PutMapping("/{id}/seen")
    public void markAsSeen(@PathVariable Long id) {
        notificationService.markAsSeen(id);
    }

    // 🔥 4. Mark all notifications as seen for a user
    @PutMapping("/user/{userId}/mark-all-seen")
    public void markAllAsSeen(@PathVariable Long userId) {
        notificationService.markAllAsSeen(userId);
    }

    // 🔥 5. Delete a notification
    @DeleteMapping("/{id}")
    public void deleteNotification(@PathVariable Long id) {
        notificationService.deleteNotification(id);
    }
}
