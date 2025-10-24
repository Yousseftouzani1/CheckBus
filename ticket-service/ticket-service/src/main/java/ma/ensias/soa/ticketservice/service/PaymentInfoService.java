package ma.ensias.soa.ticketservice.service;

import java.sql.Timestamp;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;
import ma.ensias.soa.ticketservice.dto.PaymentEventDTO;
import ma.ensias.soa.ticketservice.dto.PaymentInfoDTO;
import ma.ensias.soa.ticketservice.entity.PaymentInfo;
import ma.ensias.soa.ticketservice.enums.PaymentStatus;
import ma.ensias.soa.ticketservice.mapper.PaymentInfoMapper;
import ma.ensias.soa.ticketservice.repository.PaymentInfoRepository;

@Service
@Transactional
@RequiredArgsConstructor
public class PaymentInfoService {

private PaymentInfoRepository repository;
private PaymentInfoMapper paymentInfoMapper;

public PaymentInfoService(PaymentInfoRepository repository,PaymentInfoMapper paymentInfoMapper){
    this.repository=repository;
    this.paymentInfoMapper =paymentInfoMapper;
}


// register payement data for audit 
public PaymentInfoDTO registerPayment(PaymentEventDTO paymentEventDTO) {

        PaymentStatus status = paymentEventDTO.getStatus();

        if (status == PaymentStatus.PENDING) {
            System.out.println("Skipping PENDING payment for ticket ID: " + paymentEventDTO.getTicketId());
            return null;
        }

        // 1️⃣ Map DTO → Entity
        PaymentInfo paymentInfo = paymentInfoMapper.toEntity(paymentEventDTO);
        paymentInfo.setLastUpdate(new Timestamp(System.currentTimeMillis()));

        // 2️⃣ Save only meaningful payment results
        PaymentInfo savedPayment = repository.save(paymentInfo);

        // 3️⃣ Return DTO
        return paymentInfoMapper.toDto(savedPayment);
    }

/*
Store metadata	Include previousStatus, newStatus, changedBy, changedAt.
Provide read access	Allow viewing the full lifecycle of a ticket .
Archive old history	Optionally archive logs after a certain period to keep DB clean.
 */


}
