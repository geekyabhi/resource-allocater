package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct{
	RABBIT_MQ_URL string
	QUEUE_NAME string
	EXCHANGE_NAME string
	MAIL_BINDING_KEY string
	DB_URL string
}

var ConfigVar Config

func LoadConfig(){
	err:=godotenv.Load()
	if err!=nil{
		log.Fatal("Error while loading variables")
	}
	ConfigVar.QUEUE_NAME="ECOMMERCE_QUEU"
	ConfigVar.EXCHANGE_NAME="ECOMMERCE"
	ConfigVar.MAIL_BINDING_KEY="MAIL_SERVICE"
	ConfigVar.RABBIT_MQ_URL=string(os.Getenv("RABBIT_MQ_URL"))
	ConfigVar.DB_URL=string(os.Getenv("DB_URL"))
}