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

var topic = "user-data"
var temp_signal = make(chan bool)
var cfg, _ = utils.Load()
var verifire_db_name = cfg.VerifireDBName
var collection = "users"

type UserEvent struct {
	Event string `json:"event"`
	Data  struct {
		ID                string `json:"id"`
		Email             string `json:"email"`
		FirstName         string `json:"first_name"`
		LastName          string `json:"last_name"`
		PhoneNumber       string `json:"phone_number"`
		Gender            string `json:"gender"`
		Password          string `json:"password"`
		Verified          bool   `json:"verified"`
		Admin             bool   `json:"admin"`
		EmailNotification bool   `json:"email_notification"`
		SMSNotification   bool   `json:"sms_notification"`
		Salt              string `json:"salt"`
	}
}

func StartConsumer(kafkaConsumer *kafka.Consumer, wg *sync.WaitGroup) {
	wg.Add(1)
	defer wg.Done()
	fmt.Println("Starting User Data Consumer")

	for {
		select {
		case <-temp_signal:
			fmt.Println("Received termination signal. Closing User Data Consumer...")
			return
		default:
			msg, _ := kafkaConsumer.ReadMessage(time.Nanosecond)
			if msg != nil {
				// fmt.Printf("Topic User Data - Received message: Key: %s, Value: %s\n", string(msg.Key), string(msg.Value))
				ProcessData(msg)
			}
		}
	}
}

func ProcessData(msg *kafka.Message) {
	var user UserEvent
	err := json.Unmarshal(msg.Value, &user)
	if err != nil {
		fmt.Println("Error while parsing user")
		return
	}
	event := user.Event
	id := user.Data.ID
	first_name := user.Data.FirstName
	last_name := user.Data.LastName
	email := user.Data.Email
	password := user.Data.Password
	phone_number := user.Data.PhoneNumber
	gender := user.Data.Gender
	salt := user.Data.Salt
	verified := user.Data.Verified
	admin := user.Data.Admin
	email_notification := user.Data.EmailNotification
	sms_notification := user.Data.SMSNotification

	switch event {
	case "ADD_USER":
		mongo_data_to_insert := bson.M{
			"id":                 id,
			"first_name":         first_name,
			"last_name":          last_name,
			"email":              email,
			"password":           password,
			"phone_number":       phone_number,
			"gender":             gender,
			"salt":               salt,
			"verified":           verified,
			"admin":              admin,
			"email_notification": email_notification,
			"sms_notification":   sms_notification,
		}
		utils.InsertOne(verifire_db_name, collection, mongo_data_to_insert)

	case "DELETE_USER":
		filter := bson.M{"id": id}
		utils.DeleteOne(verifire_db_name, collection, filter)

	case "UPDATE_USER":
		filter := bson.M{"id": id}
		mongo_data_to_update := bson.M{"$set": bson.M{
			"first_name":         first_name,
			"last_name":          last_name,
			"email":              email,
			"password":           password,
			"phone_number":       phone_number,
			"gender":             gender,
			"salt":               salt,
			"verified":           verified,
			"admin":              admin,
			"email_notification": email_notification,
			"sms_notification":   sms_notification,
		}}
		utils.UpdateOne(verifire_db_name, collection, filter, mongo_data_to_update, "machines")
	}
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

func UserDataConsumer() *utils.KafkaConsumer {
	consumer, err := utils.NewKafkaConsumer(topic, topic)
	if err != nil {
		panic(err)
	}

	return consumer
}

func StopAndClose(consumer *utils.KafkaConsumer) {
	consumer.CloseConsumer()
}
