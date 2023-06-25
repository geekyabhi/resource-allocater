package respository

import (
	"github.com/geekyabhi/sendmailmicro/src/database/connection"
	"github.com/geekyabhi/sendmailmicro/src/models"
	"gorm.io/gorm"
)

func Add_Event_Detail(id string , event string , message string)(*gorm.DB,error){
	event_detail:=models.Eventdetail{
		Id:id,
		Event: event,
		Message: message,
	}

	event_detail_result:=connection.DB.Create(&event_detail)
	if event_detail_result.Error !=nil{
		return nil,event_detail_result.Error
	}
	return event_detail_result,nil
}

func Find_One_Event_Detail(id string,event string , message string) *models.Eventdetail{
	var event_detail models.Eventdetail
	connection.DB.Where(&models.Eventdetail{Id: id,Event: event,Message: message}).First(&event_detail)
	return &event_detail
}