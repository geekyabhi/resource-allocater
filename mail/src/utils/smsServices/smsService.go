package smsservice

import "fmt"

func SendSMS(phone string ,message string){
	fmt.Printf("SMS send to %s \n",phone)
}