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

var topic = "user-data"
var temp_signal = make(chan bool)



func StartConsumer(kafkaConsumer *kafka.Consumer, wg *sync.WaitGroup) {
	wg.Add(1)
	defer wg.Done()
	fmt.Println("Starting User Data Consumer")

	for {
		select {
		case <-temp_signal:
			fmt.Println("Received termination signal. Closing Topic 1 consumer...")
			return
		default:
			msg, _ := kafkaConsumer.ReadMessage(time.Millisecond)
			if msg != nil {
				fmt.Printf("Topic User Data - Received message: Key: %s, Value: %s\n", string(msg.Key), string(msg.Value))
				db_pool := utils.GetDB(utils.Db_name_mapping["resource-user"])
				utils.QueryDatabase(db_pool,"SELECT * FROM 'public'.'user'")
			}
		}
	}
}

func UserDataConsumer() *utils.KafkaConsumer {
	consumer, err := utils.NewKafkaConsumer(topic, topic)
	if err != nil {
		panic(err)
	}

	return consumer
}

func RunUserDataConsumer(consumer *utils.KafkaConsumer) {
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
