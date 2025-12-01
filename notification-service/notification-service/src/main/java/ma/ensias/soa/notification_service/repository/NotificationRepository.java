package ma.ensias.soa.notification_service.repository;

import ma.ensias.soa.notification_service.entity.Notification;
import ma.ensias.soa.notification_service.enums.NotificationType;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(Long userId, Pageable pageable);

    Page<Notification> findByUserIdAndSeenOrderByCreatedAtDesc(Long userId, boolean seen, Pageable pageable);

    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    long countByUserIdAndSeenFalse(Long userId);

    @Modifying
    @Query("UPDATE Notification n SET n.seen = true WHERE n.userId = :userId")
    void markAllSeenByUserId(Long userId);

    Page<Notification> findByUserIdAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable);

    Page<Notification> findByUserIdAndTypeOrderByCreatedAtDesc(
            Long userId,
            NotificationType type,
            Pageable pageable);

    Page<Notification> findByUserIdAndTypeAndSeenOrderByCreatedAtDesc(
            Long userId,
            NotificationType type,
            boolean seen,
            Pageable pageable);

    Page<Notification> findByUserIdAndTypeAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId,
            NotificationType type,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable);

    Page<Notification> findByUserIdAndSeenAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId,
            boolean seen,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable);

    Page<Notification> findByUserIdAndTypeAndSeenAndCreatedAtBetweenOrderByCreatedAtDesc(
            Long userId,
            NotificationType type,
            boolean seen,
            LocalDateTime from,
            LocalDateTime to,
            Pageable pageable);

}
