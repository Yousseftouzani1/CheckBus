package ma.ensias.soa.ticketservice.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.ensias.soa.ticketservice.entity.PaymentInfo;
import ma.ensias.soa.ticketservice.entity.Ticket;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo,Long>{
        List<PaymentInfo> findByTicket(Ticket tic);
        PaymentInfo findById(long id);
        List<PaymentInfo> findByTicketId(Long ticket_id);
        List<PaymentInfo> findByStatus(PaymentStatus status);

}
