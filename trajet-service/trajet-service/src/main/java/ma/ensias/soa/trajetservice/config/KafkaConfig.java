package ma.ensias.soa.trajetservice.config;

import ma.ensias.soa.trajetservice.dto.TrajetEventDTO;
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

    // 1️⃣ Define the Kafka producer configuration
    @Bean
    public ProducerFactory<String, TrajetEventDTO> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "localhost:9092"); // Kafka broker
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    // 2️⃣ Define the KafkaTemplate used to send messages
    @Bean
    public KafkaTemplate<String, TrajetEventDTO> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }

    // 3️⃣ Define the Kafka topic for trajet updates/cancellations
    @Bean
    public NewTopic trajetStatusTopic() {
        return TopicBuilder.name("trajet-status-topic")
                .partitions(3)
                .replicas(1)
                .build();
    }
}
