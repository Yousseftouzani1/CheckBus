package ma.ensias.soa.notification_service.config;

import java.util.HashMap;
import java.util.Map;

import ma.ensias.soa.notification_service.dto.payment.PaymentEvent;
import ma.ensias.soa.notification_service.dto.subscription.SubscriptionEvent;
import ma.ensias.soa.notification_service.dto.ticket.RefundRequestEvent;

import org.apache.kafka.clients.admin.NewTopic;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.StringDeserializer;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.config.TopicBuilder;

import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import org.springframework.kafka.support.serializer.JsonDeserializer;

@Configuration
public class KafkaConfig {

    private static final String BOOTSTRAP = "kafka:29092";
    private static final String GROUP = "notification-service-group";

    /* ============================================================
          UTILITY: Create a safe, cleaned JsonDeserializer
       ============================================================ */
    private <T> JsonDeserializer<T> createDeserializer(Class<T> clazz) {
        JsonDeserializer<T> deserializer = new JsonDeserializer<>(clazz);

        // 🔥 IMPORTANT FIXES TO PREVENT BaseEvent/metadata ERRORS
        deserializer.addTrustedPackages("*");
        deserializer.setUseTypeHeaders(false);
        deserializer.setRemoveTypeHeaders(true);
        deserializer.setUseTypeMapperForKey(false);

        return deserializer;
    }

    /* =====================================================================
        CONSUMER 1: SubscriptionEvent (From subscription-service)
       ===================================================================== */
    @Bean
    public ConsumerFactory<String, SubscriptionEvent> subscriptionConsumerFactory() {

        JsonDeserializer<SubscriptionEvent> deserializer =
                createDeserializer(SubscriptionEvent.class);

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, SubscriptionEvent>
            subscriptionKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, SubscriptionEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(subscriptionConsumerFactory());
        return factory;
    }

    /* =====================================================================
        CONSUMER 2: PaymentEvent (From payment-service)
       ===================================================================== */
    @Bean
    public ConsumerFactory<String, PaymentEvent> paymentConsumerFactory() {

        JsonDeserializer<PaymentEvent> deserializer =
                createDeserializer(PaymentEvent.class);

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, PaymentEvent>
            paymentKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, PaymentEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(paymentConsumerFactory());
        return factory;
    }

    /* =====================================================================
        CONSUMER 3: RefundRequestEvent (From ticket-service)
       ===================================================================== */
    @Bean
    public ConsumerFactory<String, RefundRequestEvent> refundConsumerFactory() {

        JsonDeserializer<RefundRequestEvent> deserializer =
                createDeserializer(RefundRequestEvent.class);

        Map<String, Object> props = new HashMap<>();
        props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, BOOTSTRAP);
        props.put(ConsumerConfig.GROUP_ID_CONFIG, GROUP);
        props.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);

        return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), deserializer);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RefundRequestEvent>
            refundKafkaListenerContainerFactory() {

        ConcurrentKafkaListenerContainerFactory<String, RefundRequestEvent> factory =
                new ConcurrentKafkaListenerContainerFactory<>();

        factory.setConsumerFactory(refundConsumerFactory());
        return factory;
    }

    /* =====================================================================
        TOPICS (only declare, NotificationService does NOT produce)
       ===================================================================== */
    @Bean
    public NewTopic subscriptionEventTopic() {
        return TopicBuilder.name("subscription-event-topic").partitions(3).replicas(1).build();
    }

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
