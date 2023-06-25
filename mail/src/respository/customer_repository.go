package respository

import (
	"github.com/geekyabhi/sendmailmicro/src/database/connection"
	"github.com/geekyabhi/sendmailmicro/src/models"
)

func Add_Customer(id string, first_name string,last_name string ,phone string ,email string , sms_notification bool , email_notification bool,sqlid string) (*models.User ,error){
	
	customer:=models.User{
		Id:id,		
		SQLId: sqlid,
		First_name: first_name,
		Last_name: last_name,
		Email: email,
		Phone: phone,
		SMS_Notification: sms_notification,
		EMAIL_Notification: email_notification,
	}

	customer_result:=connection.DB.Create(&customer)
	if customer_result.Error!=nil{
		return nil,customer_result.Error
	}
	return &customer,nil
}

func Find_One_Customer(sqlid string,first_name string ,last_name string,phone string,id string,email string) *models.User{
	var customer models.User
	connection.DB.Where(&models.User{SQLId: sqlid,Email: email,Phone: phone,First_name: first_name,Last_name: last_name,Id: id}).First(&customer)
	return &customer
}

func Find_All_Customer(sqlid string,first_name string ,last_name string,phone string,id string,email string)[]models.User{
	var customers []models.User
	connection.DB.Where(&models.User{SQLId: sqlid,Email: email,Phone: phone,First_name: first_name,Last_name: last_name,Id: id}).Find(&customers)
	return customers
}

func Update_One_Customer(sqlid string,first_name string ,last_name string ,phone string,email string, sms_notification bool , email_notification bool) {
	connection.DB.Model(&models.User{}).Where("sqlid = ? ",sqlid).Updates(
		map[string]interface{}{"first_name":first_name,"last_name":last_name,"phone":phone,"email":email,"sms_notification":sms_notification,"email_notification":email_notification})
}