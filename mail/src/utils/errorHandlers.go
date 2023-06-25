package utils

import (
	"fmt"
	"log"
	"os"
)

func HandleError(err error, event string,serious bool){
	if err!=nil{
		fmt.Printf("Error occured while %s",event)
		log.Fatal(err)
		if serious {
			os.Exit(0)
		}
	}
}