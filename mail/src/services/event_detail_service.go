package services

import (
	"os/exec"

	"github.com/geekyabhi/sendmailmicro/src/models"
	"github.com/geekyabhi/sendmailmicro/src/respository"
	"gorm.io/gorm"
)

func Add_Event(event string ,message string)(*gorm.DB,error){
	uuid ,err := exec.Command("uuidgen").Output()
	if err!=nil{
		return nil,err
	}
	id := string(uuid)
	result,err:=respository.Add_Event_Detail(id,event,message)
	if err!=nil{
		return nil,err
	}
	return result,nil
}

func Find_One_Event_Detail(event string)*models.Eventdetail{
	result:=respository.Find_One_Event_Detail("",event,"")
	return result
}
