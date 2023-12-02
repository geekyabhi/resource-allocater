package main

import (
	"fmt"
	"os"
	"os/signal"
	"sync"

	"github.com/geekyabhi/resource-allocater/consumers"
	"github.com/geekyabhi/resource-allocater/utils"
)

func runConsumer(consumer *utils.KafkaConsumer, wg *sync.WaitGroup, consumerFunc func(consumer *utils.KafkaConsumer)) {
	wg.Add(1)
	defer wg.Done()
	consumerFunc(consumer)
}

var cfg, _ = utils.Load()
var user_db_name = cfg.ResourceAllocatorUserDbName
var user_host = cfg.ResourceAllocatorUserHost
var user_password = cfg.ResourceAllocatorUserPassword
var user_user_name = cfg.ResourceAllocatorUserUserName
var user_port = cfg.ResourceAllocatorUserPort

var allocator_db_name = cfg.ResourceAllocatorAllocatorDbName
var allocator_host = cfg.ResourceAllocatorAllocatorHost
var allocator_password = cfg.ResourceAllocatorAllocatorPassword
var allocator_user_name = cfg.ResourceAllocatorAllocatorUserName
var allocator_port = cfg.ResourceAllocatorAllocatorPort


func initiateAllDB(){

	utils.InitDB(allocator_host,allocator_port,allocator_user_name,allocator_password,allocator_db_name)
	utils.Db_name_mapping["resource-allocator"] = allocator_db_name

	utils.InitDB(user_host,user_port,user_user_name,user_password,user_db_name)
	utils.Db_name_mapping["resource-user"] = user_db_name

}

func main() {
	var wg sync.WaitGroup
	initiateAllDB()
	go runConsumer(consumers.UserDataConsumer(), &wg, consumers.RunUserDataConsumer)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	<-signals

	wg.Wait()

	fmt.Println("All consumers have stopped.")
}
