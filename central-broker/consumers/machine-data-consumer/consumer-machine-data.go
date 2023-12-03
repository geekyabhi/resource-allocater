package consumers

import (
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"sync"
	"time"

	"github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/geekyabhi/resource-allocater/utils"
	"go.mongodb.org/mongo-driver/bson"
)

var topic = "machine-data"
var temp_signal = make(chan bool)

type MachineEvent struct {
	Event string `json:"event"`
	Data  struct {
		ID              string `json:"id"`
		Name            string `json:"name"`
		ImageName       string `json:"image_name"`
		DefaultPort     int    `json:"default_port"`
		Image           string `json:"image"`
		BackGroundImage string `json:"backGroundImage"`

		IsActive  bool                   `json:"isactive"`
		Props     map[string]interface{} `json:"props"`
		MachineID string                 `json:"machine_id"`
		CreatedAt time.Time              `json:"createdAt"`
		UpdatedAt time.Time              `json:"updatedAt"`
	} `json:"data"`
}

func StartConsumer(kafkaConsumer *kafka.Consumer, wg *sync.WaitGroup) {
	wg.Add(1)
	defer wg.Done()
	fmt.Println("Starting Machine Data Consumer")

	for {
		select {
		case <-temp_signal:
			fmt.Println("Received termination signal. Closing Machine Data consumer...")
			return
		default:
			msg, _ := kafkaConsumer.ReadMessage(time.Millisecond)
			if msg != nil {
				// fmt.Printf("Topic User Data - Received message: Key: %s, Value: %s\n", string(msg.Key), string(msg.Value))
				ProcessData(msg)
			}
		}
	}
}

func ProcessData(msg *kafka.Message) {
	var machineMessageData MachineEvent
	err := json.Unmarshal(msg.Value, &machineMessageData)
	if err != nil {
		fmt.Println("Error while parsing machine")
		return
	}
	if machineMessageData.Event == "ADD_MACHINE" {

		data_to_insert := bson.M{"_id": machineMessageData.Data.ID,
			"name":            machineMessageData.Data.Name,
			"machine_id":      machineMessageData.Data.MachineID,
			"image_name":      machineMessageData.Data.ImageName,
			"default_port":    machineMessageData.Data.DefaultPort,
			"image":           machineMessageData.Data.Image,
			"backGroundImage": machineMessageData.Data.BackGroundImage,
			"isactive":        machineMessageData.Data.IsActive,
			"props":           machineMessageData.Data.Props,
			"createdAt":       machineMessageData.Data.CreatedAt,
			"updatedAt":       machineMessageData.Data.UpdatedAt,
		}
		utils.InsertOne("allocator", "machines", data_to_insert)

	} else if machineMessageData.Event == "DELETE_MACHINE" {
		filter := bson.M{"machine_id": machineMessageData.Data.MachineID}
		utils.DeleteOne("allocator", "machines", filter)
	} else if machineMessageData.Event == "UPDATE_MACHINE" {

		filter := bson.M{"machine_id": machineMessageData.Data.MachineID}

		data_to_update := bson.M{"$set": bson.M{"_id": machineMessageData.Data.ID,
			"name":            machineMessageData.Data.Name,
			"machine_id":      machineMessageData.Data.MachineID,
			"image_name":      machineMessageData.Data.ImageName,
			"default_port":    machineMessageData.Data.DefaultPort,
			"image":           machineMessageData.Data.Image,
			"backGroundImage": machineMessageData.Data.BackGroundImage,
			"isactive":        machineMessageData.Data.IsActive,
			"props":           machineMessageData.Data.Props,
			"createdAt":       machineMessageData.Data.CreatedAt,
			"updatedAt":       machineMessageData.Data.UpdatedAt,
		}}
		utils.UpdateOne("allocator", "machines", filter, data_to_update)
	}

}

func MachineDataConsumer() *utils.KafkaConsumer {
	consumer, err := utils.NewKafkaConsumer(topic, topic)
	if err != nil {
		panic(err)
	}

	return consumer
}

func RunMachineDataConsumer(consumer *utils.KafkaConsumer) {
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
