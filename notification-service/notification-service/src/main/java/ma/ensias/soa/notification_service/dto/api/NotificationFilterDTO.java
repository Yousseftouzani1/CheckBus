package ma.ensias.soa.notification_service.dto.api;

import lombok.*;
import ma.ensias.soa.notification_service.enums.NotificationType;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationFilterDTO {

    private int page = 0;
    private int size = 10;

    private Boolean seen;  // null = all

    private NotificationType type; // null = all

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime from;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime to;
}
