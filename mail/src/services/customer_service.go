package services

import (
	"fmt"

	"github.com/geekyabhi/sendmailmicro/src/models"
	"github.com/geekyabhi/sendmailmicro/src/respository"
)

func Add_Customer(first_name string, last_name string,email string ,phone string, sqlid string , sms_notification bool , email_notification bool)(*models.User,error){
	// uuid ,err := exec.Command("uuidgen").Output()
	// if err!=nil{
	// 	fmt.Println("Error occured while creating UUID")
	// 	fmt.Println(err)
	// 	return nil,err
	// }
	// id := string(uuid)


	result,err:=respository.Add_Customer(sqlid,first_name,last_name,phone,email,sms_notification,email_notification,sqlid)
	if err!=nil{
		fmt.Println("Error occured while adding customer")
		fmt.Println(err)
		return nil,err
	}
	fmt.Println(*result)
	return result,nil
}

func Find_One_Customer(sqlid string)*models.User{
	result:=respository.Find_One_Customer(sqlid,"","","","","")
	return result
}

func Update_One_Customer(sqlid string , first_name string,last_name,email string ,phone string,sms_notification bool, email_notification bool){
	respository.Update_One_Customer(sqlid,first_name,last_name,phone,email,sms_notification,email_notification)
}