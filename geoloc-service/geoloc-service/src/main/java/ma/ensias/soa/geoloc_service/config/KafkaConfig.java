package ma.ensias.soa.geoloc_service.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaConfig {

    @Bean
    public NewTopic busPositionTopic() {
        return TopicBuilder.name("bus.position.update").build();
    }
}

