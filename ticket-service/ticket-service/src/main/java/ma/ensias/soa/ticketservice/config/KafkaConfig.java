package ma.ensias.soa.ticketservice.config;

import ma.ensias.soa.ticketservice.dto.PaymentEventDTO;
import ma.ensias.soa.ticketservice.dto.RefundRequestDTO;
import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;
import org.springframework.kafka.support.serializer.JsonSerializer;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConfig {

    // Configure the producer factory
    @Bean
    public ProducerFactory<String, RefundRequestDTO> refundProducerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092"); // Kafka broker
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    // Create a KafkaTemplate for RefundRequestDTO
    @Bean
    public KafkaTemplate<String, RefundRequestDTO> refundKafkaTemplate() {
        return new KafkaTemplate<>(refundProducerFactory());
    }

    // clare topics (optional — auto-created if auto.create.topics.enable=true)
    @Bean
    public NewTopic refundRequestTopic() {
        return TopicBuilder.name("refund-request-topic").partitions(3).replicas(1).build();
    }
}
