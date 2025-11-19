package ma.ensias.soa.subscription_service.config;

import java.util.HashMap;
import java.util.Map;

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

import ma.ensias.soa.subscription_service.dto.SubscriptionEvent;

@Configuration
public class KafkaConfig {

    /*  =============================================================
        TOPIC: subscription-event-topic
        ============================================================= 
     */
    
    @Bean
    public NewTopic subscriptionEventTopic() {
        return TopicBuilder
                .name("subscription-event-topic")
                .build();
    }


    /* 
        =============================================================
        PRODUCER: SubscriptionEvent
        =============================================================
        
     */
    @Bean
    public ProducerFactory<String, SubscriptionEvent> subscriptionProducerFactory() {
        Map<String, Object> config = new HashMap<>();

        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, "kafka:29092");
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG, JsonSerializer.class);

        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, SubscriptionEvent> subscriptionKafkaTemplate() {
        return new KafkaTemplate<>(subscriptionProducerFactory());
    }
}
