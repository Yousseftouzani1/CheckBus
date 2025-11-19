package ma.ensias.soa.paymentservice.config;

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

import ma.ensias.soa.paymentservice.dto.PaymentEventDTO;
import ma.ensias.soa.paymentservice.dto.RefundRequestDTO;

@Configuration
public class KafkaConfig {

    /* =============================================================
        PRODUCER: PaymentEventDTO
       ============================================================= */
    @Bean
    public ProducerFactory<String, PaymentEventDTO> paymentProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
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

    // 🔹 Configure le désérialiseur UNIQUEMENT en Java (pas via props)
    JsonDeserializer<RefundRequestDTO> deserializer = new JsonDeserializer<>(RefundRequestDTO.class);
    deserializer.addTrustedPackages("*");      // autorise tous les packages
    deserializer.ignoreTypeHeaders();          // ignore les headers __TypeId__

    // 🔹 Propriétés de base du consumer
    Map<String, Object> props = new HashMap<>();
    props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
    props.put(ConsumerConfig.GROUP_ID_CONFIG, "payment-service-group");
    props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
    props.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG, JsonDeserializer.class);
    // ❌ Ne mets PAS JsonDeserializer.TRUSTED_PACKAGES ici → conflit garanti

    // ✅ Utilise ton deserializer configuré manuellement
    return new DefaultKafkaConsumerFactory<>(
            props,
            new StringDeserializer(),
            deserializer
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
