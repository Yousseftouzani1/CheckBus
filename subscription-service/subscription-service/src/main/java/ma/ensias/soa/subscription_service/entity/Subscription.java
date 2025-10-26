package ma.ensias.soa.subscription_service.entity;

import ma.ensias.soa.subscription_service.Enums.SubscriptionStatus;
import ma.ensias.soa.subscription_service.Enums.PlanType;



import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {


    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    
    private Long userId;


    @Enumerated(EnumType.STRING)
    private PlanType planType; 


    private double price;


    private LocalDateTime startDate;


    private LocalDateTime endDate;


    @Enumerated(EnumType.STRING)
    private SubscriptionStatus status;


    private boolean autoRenew;
    
}