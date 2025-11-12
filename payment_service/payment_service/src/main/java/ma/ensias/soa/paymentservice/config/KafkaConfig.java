package ma.ensias.soa.paymentservice.config;

import ma.ensias.soa.paymentservice.dto.PaymentEventDTO;
import ma.ensias.soa.paymentservice.dto.RefundRequestDTO;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.*;
import org.springframework.kafka.support.serializer.JsonDeserializer;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {

    /* =============================================================
        PRODUCER: PaymentEventDTO
       ============================================================= */
    @Bean
    public ProducerFactory<String, PaymentEventDTO> paymentProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, PaymentEventDTO> paymentKafkaTemplate() {
        return new KafkaTemplate<>(paymentProducerFactory());
    }

    /* =============================================================
        CONSUMER: RefundRequestDTO
       ============================================================= */
    @Bean
    public ConsumerFactory<String, RefundRequestDTO> refundConsumerFactory() {
        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092");
        props.put(ConsumerConfig.GROUP_ID_CONFIG, "payment-service-group");
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
        props.put(JsonDeserializer.TRUSTED_PACKAGES, "ma.ensias.soa.paymentservice.dto");
        return new DefaultKafkaConsumerFactory<>(
                props,
                new StringDeserializer(),
                new JsonDeserializer<>(RefundRequestDTO.class)
        );
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RefundRequestDTO> refundKafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RefundRequestDTO> factory =
                new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(refundConsumerFactory());
        return factory;
    }

    /* =============================================================
        TOPICS 
       ============================================================= */
    @Bean
    public NewTopic paymentStatusTopic() {
        return TopicBuilder.name("payment-status-topic").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic subscriptionPaymentTopic() {
        return TopicBuilder.name("subscription-payment-topic").partitions(3).replicas(1).build();
    }

    @Bean
    public NewTopic refundRequestTopic() {
        return TopicBuilder.name("refund-request-topic").partitions(3).replicas(1).build();
    }
}
