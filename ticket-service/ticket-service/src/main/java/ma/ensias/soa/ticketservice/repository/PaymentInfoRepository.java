package ma.ensias.soa.ticketservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.ensias.soa.ticketservice.entity.PaymentInfo;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;


@Repository
public interface PaymentInfoRepository extends JpaRepository<PaymentInfo, Long> {

    // Find all payment info entries for a specific Ticket entity
    List<PaymentInfo> findByTicket(Ticket ticket);

    // Find all payment info entries by the ticket's ID (foreign key)
    List<PaymentInfo> findByTicket_Id(Long ticketId);

    // Find all payment info entries with a given status
    List<PaymentInfo> findByStatus(PaymentStatus status);
}

