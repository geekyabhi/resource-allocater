package utils

import (
	"fmt"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

var brokers = "dory.srvs.cloudkafka.com:9094"
var username = "ywbuiicx"
var password = "Rdax0h8daCKlb_ctORblOzDzwY0o3qql"

// KafkaConsumer is a struct to manage a Kafka consumer instance.
type KafkaConsumer struct {
    consumer *kafka.Consumer
}

// NewKafkaConsumer initializes a KafkaConsumer for a specified topic.
func NewKafkaConsumer(topic string, groupID string) (*KafkaConsumer, error) {
    // Kafka configuration
    config := &kafka.ConfigMap{
        "bootstrap.servers": brokers,
        "group.id":          groupID,
        "auto.offset.reset": "earliest", // Set to "latest" if you want to consume only new messages
        "security.protocol": "sasl_ssl",
        "sasl.mechanisms":   "SCRAM-SHA-512",
        "sasl.username":     username,
        "sasl.password":     password,
    }

    // Create a new Kafka consumer
    consumer, err := kafka.NewConsumer(config)
    if err != nil {
        return nil, fmt.Errorf("Error creating Kafka consumer: %v", err)
    }

    // Subscribe to the specified topic
    err = consumer.SubscribeTopics([]string{topic}, nil)
    if err != nil {
        return nil, fmt.Errorf("Error subscribing to topic %s: %v", topic, err)
    }

    return &KafkaConsumer{
        consumer: consumer,
    }, nil
}

// CloseConsumer closes the Kafka consumer.
func (kc *KafkaConsumer) CloseConsumer() {
    kc.consumer.Close()
}

// GetConsumer returns the underlying Kafka consumer instance.
func (kc *KafkaConsumer) GetConsumer() *kafka.Consumer {
    return kc.consumer
}
