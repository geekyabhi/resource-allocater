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
var db_name = cfg.ResourceAllocatorAllocatorDbName
var mongo_master_db_name = cfg.ResourceAllocatorMachineMasterDbName
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

	var userQuery, machineQuery string
	machineQuery = ""
	if event == "ADD_USER" {
		userQuery = fmt.Sprintf(`
		INSERT INTO user (
			id, first_name, last_name, email, password, phone_number, gender, salt, verified,admin , email_notification, sms_notification
		) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', %t,%t, %t, %t)`, id, first_name, last_name, email, password, phone_number, gender, salt, verified, admin, email_notification, sms_notification)

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
		fmt.Println("dcjijcijdijdicjijcijicjicjidjcidjcijdicjdijci")
		utils.InsertOne(mongo_master_db_name, collection, mongo_data_to_insert, "machines")

	} else if event == "DELETE_USER" {
		userQuery = fmt.Sprintf(`
			DELETE FROM user WHERE id = '%s'
		`, id)
		machineQuery = fmt.Sprintf(`
			DELETE FROM machineallocation WHERE uid = '%s'
		`, id)
		filter := bson.M{"id": id}
		utils.DeleteOne(mongo_master_db_name, collection, filter, "machines")

	} else if event == "UPDATE_USER" {
		userQuery = fmt.Sprintf(`
			UPDATE user 
			SET 
				first_name = '%s', 
				last_name = '%s', 
				email = '%s', 
				password = '%s', 
				phone_number = '%s', 
				gender = '%s', 
				salt = '%s', 
				verified = %t, 
				admin = %t, 
				email_notification = %t, 
				sms_notification = %t 
			WHERE 
				id = '%s'`,
			first_name, last_name, email, password, phone_number, gender, salt, verified, admin, email_notification, sms_notification, id)

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
		utils.UpdateOne(mongo_master_db_name, collection, filter, mongo_data_to_update, "machines")

	}
	db_pool := utils.GetSQLDB(db_name)
	result, err := utils.QuerySQLDatabase(db_pool, userQuery)
	if machineQuery != "" {
		result, err = utils.QuerySQLDatabase(db_pool, machineQuery)
	}
	if err != nil {
		fmt.Printf("error %s", err)
	}
	utils.PrintSQLResult(result)
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
