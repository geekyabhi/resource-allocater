package utils

import (
	"encoding/json"
	"fmt"

	"github.com/geekyabhi/sendmailmicro/src/config"
	"github.com/streadway/amqp"
)

type messageType struct{
	First_name string
	Last_name string
	Email string
	Phone string
	Id string
	SMS_Notification bool
	EMAIL_Notification bool
	Event string
	OTP string
}


func Connect() (*amqp.Channel,error){
	conn ,err := amqp.Dial(config.ConfigVar.RABBIT_MQ_URL)
	HandleError(err,"connecting broker",false)

	channel,err := conn.Channel()
	HandleError(err,"creating channel",false)
	
	err = channel.ExchangeDeclare(config.ConfigVar.EXCHANGE_NAME,"direct",true,false,false,false,nil)
	HandleError(err,"declaring exchange",false)

	fmt.Println("Connected to Rabbit MQ")
	return channel,nil	
}


func Subscribe(channel *amqp.Channel){

	queue, err := channel.QueueDeclare(config.ConfigVar.QUEUE_NAME,true,false,false,false,nil)
	HandleError(err,"declaring queue",false)

	err=channel.QueueBind(queue.Name,config.ConfigVar.MAIL_BINDING_KEY,config.ConfigVar.EXCHANGE_NAME,false,nil)
	HandleError(err,"binding queue",false)

	message ,err :=channel.Consume(config.ConfigVar.QUEUE_NAME,"",true,true,false,false,nil)
	HandleError(err,"consuming",false)

	forever :=make(chan bool)

	go func(){
		for d:= range message{
			var data messageType
			err:=json.Unmarshal([]byte(string(d.Body)),&data)
			HandleError(err,"unmarshling data",false)
			SendNotification(data.First_name,data.Last_name,data.Email,data.Phone,data.Id,data.Event,data.SMS_Notification,data.EMAIL_Notification,data.OTP)
		}
	}()

	<-forever
}