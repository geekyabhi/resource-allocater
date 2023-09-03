package consumers

import (
	"fmt"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/geekyabhi/resource-allocater/utils"
)

var topic = "ywbuiicx-email"
var temp_signal = make(chan bool)

func NewTopic1Consumer() *utils.KafkaConsumer {
	consumer, err := utils.NewKafkaConsumer(topic, topic)
	if err != nil {
		panic(err)
	}

	return consumer
}

func StartConsumer(kafkaConsumer *kafka.Consumer, wg *sync.WaitGroup) {
	wg.Add(1)
	defer wg.Done()
	fmt.Println("Starting Topic 1 Consumer")

	for {
		select {
		case <-temp_signal:
			fmt.Println("Received termination signal. Closing Topic 1 consumer...")
			return
		default:
			msg, _ := kafkaConsumer.ReadMessage(time.Microsecond)

			if msg != nil {
				fmt.Printf("Topic 1 - Received message: Key: %s, Value: %s\n", string(msg.Key), string(msg.Value))
			}
		}
	}
}

func RunTopic1Consumer(consumer *utils.KafkaConsumer) {
	var wg sync.WaitGroup

	kafkaConsumer := consumer.GetConsumer()
	var signals = make(chan os.Signal, 1)

	signal.Notify(signals, os.Interrupt)

	go StartConsumer(kafkaConsumer, &wg)

	select {
	case <-signals:
		fmt.Println("Signal for termination received , sending message to in temp_signal ")
		temp_signal <- true
	}

	consumer.CloseConsumer()

	wg.Wait()

}

func StopAndClose(consumer *utils.KafkaConsumer) {
	consumer.CloseConsumer()
}
