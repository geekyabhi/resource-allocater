package utils

import (
	"fmt"

	"github.com/confluentinc/confluent-kafka-go/kafka"
)

// var cfg, _ = Load()

var brokers = cfg.KafkaBrokers

type KafkaConsumer struct {
	consumer *kafka.Consumer
}

func NewKafkaConsumer(topic string, groupID string) (*KafkaConsumer, error) {
	config := &kafka.ConfigMap{
		"bootstrap.servers": brokers,
		"group.id":          groupID,
		"auto.offset.reset": "earliest",
		"security.protocol": "plaintext", // Use "plaintext" for plain text without authentication
	}

	consumer, err := kafka.NewConsumer(config)
	if err != nil {
		return nil, fmt.Errorf("error creating kafka consumer: %v", err)
	}

	err = consumer.SubscribeTopics([]string{topic}, nil)
	if err != nil {
		return nil, fmt.Errorf("error subscribing to topic %s: %v", topic, err)
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
