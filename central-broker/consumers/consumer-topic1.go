package consumers

import (
	"fmt"
	"os"
	"os/signal"
	"sync"

	"github.com/geekyabhi/resource-allocater/utils"
)

var topic = "ywbuiicx-email"

func NewTopic1Consumer() *utils.KafkaConsumer {
	consumer, err := utils.NewKafkaConsumer(topic, topic)
	if err != nil {
		panic(err)
	}

	return consumer
}

func RunTopic1Consumer(consumer *utils.KafkaConsumer) {
	// Get the Kafka consumer instance
	kafkaConsumer := consumer.GetConsumer()

	// Wait for termination signals
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	var wg sync.WaitGroup

	// Start consuming messages
	wg.Add(1)
	go func() {
		defer wg.Done()
		fmt.Println("Starting Topic 1 Consumer")

		for {
			select {
			case <-signals:
				fmt.Println("Received termination signal. Closing Topic 1 consumer...")
				return
			default:
				msg, err := kafkaConsumer.ReadMessage(-1)
				if err != nil {
					fmt.Printf("Topic 1 - Error reading message: %v\n", err)
				} else {
					fmt.Printf("Topic 1 - Received message: Key: %s, Value: %s\n", string(msg.Key), string(msg.Value))
					// Process the message here
				}
			}
		}
	}()

	// Wait for termination signal (Ctrl+C)
	<-signals

	// Close the consumer gracefully
	consumer.CloseConsumer()

	wg.Wait()
}

func StopAndClose(consumer *utils.KafkaConsumer) {
	// Close the Kafka consumer gracefully
	consumer.CloseConsumer()
}
