package mailservices

import (
	"fmt"
	"log"
	"net/smtp"
	"os"
)

func SendMail(toEmail string,message string){
	email := os.Getenv("BASE_EMAIL")
	password := os.Getenv("BASE_PASSWORD")

	auth := smtp.PlainAuth("",email,password,"smtp.gmail.com")
	err:=smtp.SendMail("smtp.gmail.com:587",auth,"thakurabhinav17122001@gmail.com",[]string{toEmail},[]byte(message))

	if err !=nil{
		log.Fatalf("Error while sending mail to %s\n",toEmail)
	}

	if err ==nil{
		fmt.Printf("Mail sent to %s\n",toEmail)
	}
}
