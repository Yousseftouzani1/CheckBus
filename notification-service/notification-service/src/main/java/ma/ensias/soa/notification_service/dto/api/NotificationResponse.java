package ma.ensias.soa.notification_service.dto.api;

import lombok.*;
import java.time.LocalDateTime;

@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;
    private String title;
    private String message;
    private LocalDateTime createdAt;
    private boolean seen;
}
