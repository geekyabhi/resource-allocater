package connection

import (
	"fmt"

	"github.com/geekyabhi/sendmailmicro/src/config"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDB() (*gorm.DB , error){
	var dbString string =config.ConfigVar.DB_URL
	var err error
	DB, err = gorm.Open(postgres.New(postgres.Config{DSN: dbString,PreferSimpleProtocol: true,}), &gorm.Config{})
	if err !=nil{
		return nil,err
	}
	fmt.Println("Database has connected")
	return DB,nil
}