package ma.ensias.soa.notification_service.entity;

import ma.ensias.soa.notification_service.enums.NotificationType;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;


@Entity
@Table(name = "notifications")
@Getter @Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long userId;              // who the notification belongs to
    private String title;           // e.g., "Ticket Refund Requested"
    private String message;           // the detailed front-end message
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private NotificationType type;


    private boolean seen;             // for marking read/unread
}
