package ma.ensias.soa.ticketservice.config;

import java.util.HashMap;
import java.util.Map;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import ma.ensias.soa.ticketservice.dto.PaymentEventDTO;
import ma.ensias.soa.ticketservice.dto.RefundRequestDTO;
import ma.ensias.soa.ticketservice.dto.TicketExpirationEvent;

@Configuration
public class KafkaConfig {
    
    /* =============================================================
        PRODUCER 1: RefundRequestDTO  (Ticket → Payment)
       ============================================================= */
    @Bean
    public ProducerFactory<String, RefundRequestDTO> refundProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, RefundRequestDTO> refundKafkaTemplate() {
        return new KafkaTemplate<>(refundProducerFactory());
    }

    /* =============================================================
        PRODUCER 2: TicketExpirationEvent (self-produce)
       ============================================================= */
    @Bean
    public ProducerFactory<String, TicketExpirationEvent> expirationProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, TicketExpirationEvent> expirationKafkaTemplate() {
        return new KafkaTemplate<>(expirationProducerFactory());
    }

    /* =============================================================
        CONSUMER 1: PaymentEventDTO  (Payment → Ticket)
       ============================================================= */
    @Bean
    public ConsumerFactory<String, PaymentEventDTO> paymentConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "ticket-service-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ma.ensias.soa.ticketservice.dto");
        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(PaymentEventDTO.class)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PaymentEventDTO> paymentKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, PaymentEventDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(paymentConsumerFactory());
        return factory;
    }

    /* =============================================================
        CONSUMER 2: TicketExpirationEvent  (self-consume)
       ============================================================= */
    @Bean
    public ConsumerFactory<String, TicketExpirationEvent> expirationConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "ticket-expiration-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ma.ensias.soa.ticketservice.dto");
        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(TicketExpirationEvent.class)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, TicketExpirationEvent> expirationKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, TicketExpirationEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(expirationConsumerFactory());
        return factory;
    }

    /* =============================================================
        TOPICS 
       ============================================================= */
    @Bean
    public NewTopic refundRequestTopic() {
        return TopicBuilder.name("refund-request-topic").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic paymentStatusTopic() {
        return TopicBuilder.name("payment-status-topic").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic ticketExpirationTopic() {
        return TopicBuilder.name("ticket-expiration-topic").partitions(3).replicas(1).build();
    }
}
