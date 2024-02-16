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

var topic = "allocation-data"
var temp_signal = make(chan bool)
var cfg, _ = utils.Load()
var verifire_db_name = cfg.VerifireDBName
var collection = "allocations"

type AllocationEvent struct {
	Event string `json:"event"`
	Data  struct {
		ID            int    `json:"id"`
		MachineID     string `json:"machine_id"`
		ContainerID   string `json:"container_id"`
		StartingDate  string `json:"starting_date"`
		EndDate       string `json:"end_date"`
		IsActive      bool   `json:"is_active"`
		Status        string `json:"status"`
		MachineName   string `json:"machine_name"`
		ContainerName string `json:"container_name"`
		PortUsed      int    `json:"port_used"`
		UID           string `json:"uid"`
	}
}

func StartConsumer(kafkaConsumer *kafka.Consumer, wg *sync.WaitGroup) {
	wg.Add(1)
	defer wg.Done()
	fmt.Println("Starting Allocation Data Consumer")

	for {
		select {
		case <-temp_signal:
			fmt.Println("Received termination signal. Closing User Data Consumer...")
			return
		default:
			msg, _ := kafkaConsumer.ReadMessage(time.Nanosecond)
			if msg != nil {
				// fmt.Printf("Topic Allocation Data - Received message: Key: %s, Value: %s\n", string(msg.Key), string(msg.Value))
				ProcessData(msg)
			}
		}
	}
}

func ProcessData(msg *kafka.Message) {
	var allocation AllocationEvent
	fmt.Println(string(msg.Value))
	err := json.Unmarshal(msg.Value, &allocation)
	if err != nil {
		fmt.Println(err)
		fmt.Println("Error while parsing user")
		return
	}
	event := allocation.Event
	machine_id := allocation.Data.MachineID
	container_id := allocation.Data.ContainerID
	is_active := allocation.Data.IsActive
	status := allocation.Data.Status
	machine_name := allocation.Data.MachineName
	container_name := allocation.Data.ContainerName
	port_used := allocation.Data.PortUsed
	uid := allocation.Data.UID

	switch event {
	case "ADD_DATA":
		fmt.Println("ADD_DATA")
		mongo_data_to_insert := bson.M{
			"machine_id":     machine_id,
			"container_id":   container_id,
			"is_active":      is_active,
			"status":         status,
			"machine_name":   machine_name,
			"container_name": container_name,
			"port_used":      port_used,
			"uid":            uid,
		}
		utils.InsertOne(verifire_db_name, collection, mongo_data_to_insert)
	case "DELETE_DATA":
		fmt.Println("DELETE")
		filter := bson.M{"container_id": container_id}
		utils.DeleteOne(verifire_db_name, collection, filter)
	case "UPDATE_DATA":
		fmt.Println("UPDATE")
		filter := bson.M{"container_id": container_id}
		mongo_data_to_update := bson.M{"$set": bson.M{
			"machine_id":     machine_id,
			"is_active":      is_active,
			"status":         status,
			"machine_name":   machine_name,
			"container_name": container_name,
			"port_used":      port_used,
			"uid":            uid,
		}}
		utils.UpdateOne(verifire_db_name, collection, filter, mongo_data_to_update)
	}
}

func RunAllocationDataConsumer(consumer *utils.KafkaConsumer) {
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

func AllocationDataConsumer() *utils.KafkaConsumer {
	consumer, err := utils.NewKafkaConsumer(topic, topic)
	if err != nil {
		panic(err)
	}

	return consumer
}

func StopAndClose(consumer *utils.KafkaConsumer) {
	consumer.CloseConsumer()
}
