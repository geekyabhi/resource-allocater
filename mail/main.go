package main

import (
	"fmt"
	"log"
	"os"

	"github.com/geekyabhi/sendmailmicro/src/database/connection"
	"github.com/geekyabhi/sendmailmicro/src/database/migrate"
	"github.com/geekyabhi/sendmailmicro/src/initializers"
	"github.com/geekyabhi/sendmailmicro/src/utils"
)

func init(){
	initializers.Initialize()
}

func main(){
	_,err:=connection.ConnectDB()
	err=migrate.Migrate()
	channel,err:=utils.Connect()
	// fmt.Print(err)
	if err!=nil{
		log.Fatal(err)
		os.Exit(1)
	}
	// services.Add_Customer("Abhinav Singh","abhinav@gmail.com","8299256573","xxyyzz",true,true)
	// services.Add_Event("profile_registered","Welcome , you have been successfully registered ")
	// services.Add_Event("profile_updated"," ")
	// services.Add_Event("profile_loggedin","Hii , someone had logged in from your account , is that you ?")
	fmt.Println("Message Service running")
	utils.Subscribe(channel)

}