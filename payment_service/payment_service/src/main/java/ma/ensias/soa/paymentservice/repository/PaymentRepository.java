package ma.ensias.soa.paymentservice.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.ensias.soa.paymentservice.entity.Payment;
import ma.ensias.soa.paymentservice.enums.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Payment findByTicketId(Long ticketId);
    Optional<Payment> findByPaymentReference(String paymentReference);
    Payment findByTicketIdAndStatus(Long ticketId, PaymentStatus status); 
    List<Payment> findAllByTicketId(Long ticketId);
    List<Payment> findAllByStatus(PaymentStatus status);
}
