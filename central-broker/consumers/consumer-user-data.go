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
)

var topic = "user-data"
var temp_signal = make(chan bool)

type User struct {
		ID                string `json:"id"`
		Email             string `json:"email"`
		FirstName         string `json:"first_name"`
		LastName          string `json:"last_name"`
		PhoneNumber       string `json:"phone_number"`
		Gender            string `json:"gender"`
		Password          string `json:"password"`
		Verified          bool   `json:"verified"`
		EmailNotification bool   `json:"email_notification"`
		SMSNotification   bool   `json:"sms_notification"`
		Salt              string `json:"salt"`
	}


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
				// fmt.Printf("Topic User Data - Received message: Key: %s, Value: %s\n", string(msg.Key), string(msg.Value))
				ProcessData(msg)
			}
		}
	}
}

func ProcessData(msg *kafka.Message){
	var user User
	err := json.Unmarshal(msg.Value,&user)
	if err!=nil{
		fmt.Println("Error while parsing user")
		return
	}
	query := fmt.Sprintf(`
		INSERT INTO user (
			id, first_name, last_name, email, password, phone_number, gender, salt, verified, email_notification, sms_notification
		) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', %t, %t, %t)`,user.ID,user.FirstName,user.LastName,user.Email,user.Password,user.PhoneNumber,user.Gender,user.Salt,user.Verified,user.EmailNotification,user.SMSNotification)
	// fmt.Println(query)
	db_pool := utils.GetDB(utils.Db_name_mapping["resource-allocator"])
	result,err := utils.QueryDatabase(db_pool,query)
	if err!=nil{
		fmt.Printf("error %s",err)
	}
	utils.PrintResult(result)
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
