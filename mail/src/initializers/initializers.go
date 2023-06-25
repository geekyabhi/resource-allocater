package initializers

import (
	"github.com/geekyabhi/sendmailmicro/src/config"
)

func Initialize(){
	config.LoadConfig()
}