package ma.ensias.soa.paymentservice.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.ensias.soa.paymentservice.entity.Payment;

public interface PaymentRepository extends JpaRepository<Payment,Long> {
    Payment findByTicketId(Long ticketId);
    Optional<Payment> findByPaymentReference(String paymentReference);

 
}
