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

var cfg, _ = utils.Load()
var topic = "machine-data"
var collection = "machines"
var db_name = cfg.ResourceAllocatorMachineDbName
var feed_db_name = cfg.ResourceAllocatorMachineFeedDbName
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
		utils.InsertOne(db_name, collection, data_to_insert)
		utils.InsertOne(feed_db_name, collection, data_to_insert, "machines")

	} else if machineMessageData.Event == "DELETE_MACHINE" {
		filter := bson.M{"machine_id": machineMessageData.Data.MachineID}
		utils.DeleteOne(db_name, collection, filter)
		utils.DeleteOne(feed_db_name, collection, filter, "machines")
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
		utils.UpdateOne(db_name, collection, filter, data_to_update)
		utils.UpdateOne(feed_db_name, collection, filter, data_to_update, "machines")
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
