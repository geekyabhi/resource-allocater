package utils

import (
	"fmt"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

var brokers = "dory.srvs.cloudkafka.com:9094"
var username = "ywbuiicx"
var password = "Rdax0h8daCKlb_ctORblOzDzwY0o3qql"

type KafkaConsumer struct {
    consumer *kafka.Consumer
}

func NewKafkaConsumer(topic string, groupID string) (*KafkaConsumer, error) {
    config := &kafka.ConfigMap{
        "bootstrap.servers": brokers,
        "group.id":          groupID,
        "auto.offset.reset": "earliest",
        "security.protocol": "sasl_ssl",
        "sasl.mechanisms":   "SCRAM-SHA-512",
        "sasl.username":     username,
        "sasl.password":     password,
    }

    consumer, err := kafka.NewConsumer(config)
    if err != nil {
        return nil, fmt.Errorf("Error creating Kafka consumer: %v", err)
    }

    err = consumer.SubscribeTopics([]string{topic}, nil)
    if err != nil {
        return nil, fmt.Errorf("Error subscribing to topic %s: %v", topic, err)
    }

    return &KafkaConsumer{
        consumer: consumer,
    }, nil
}

func (kc *KafkaConsumer) CloseConsumer() {
    kc.consumer.Close()
}

func (kc *KafkaConsumer) GetConsumer() *kafka.Consumer {
    return kc.consumer
}
