package utils

import (
	"context"
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
	adminClient, err := kafka.NewAdminClient(config)

	if err != nil {
		return nil, fmt.Errorf("error creating Kafka admin client: %v", err)
	}

	topicMetadata, err := adminClient.GetMetadata(&topic, false, 5000)
	if err != nil {
		return nil, fmt.Errorf("error getting topic metadata for %s: %v", topic, err)
	}

	if len(topicMetadata.Topics) == 0 {
		// Topic does not exist, create it
		topicConfig := kafka.TopicSpecification{
			Topic:             topic,
			NumPartitions:     1,
			ReplicationFactor: 1,
		}

		_, err := adminClient.CreateTopics(context.Background(), []kafka.TopicSpecification{topicConfig})
		if err != nil {
			return nil, fmt.Errorf("error creating topic %s: %v", topic, err)
		}

		fmt.Printf("Topic %s created successfully\n", topic)
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
