package ma.ensias.soa.ticketservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ma.ensias.soa.ticketservice.entity.PaymentInfo;
import ma.ensias.soa.ticketservice.entity.Ticket;

public interface PaymentInfoRepository extends JpaRepository<PaymentInfo,Long>{
        PaymentInfo findByTicket(Ticket tic);
        PaymentInfo findById(long id);
}
