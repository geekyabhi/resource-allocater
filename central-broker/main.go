package main

import (
	"fmt"
	"os"
	"os/signal"
	"sync"

	machine_consumers "github.com/geekyabhi/resource-allocater/consumers/machine-data-consumer"
	user_consumers "github.com/geekyabhi/resource-allocater/consumers/user-data-consumer"
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

var machine_db_name = cfg.ResourceAllocatorMachineDbName
var machine_db_uri = cfg.ResourceAllocatorMachineURI

var machine_master_db_name = cfg.ResourceAllocatorMachineMasterDbName
var machine_master_db_uri = cfg.ResourceAllocatorMachineMasterURI

var machine_feed_db_name = cfg.ResourceAllocatorMachineFeedDbName
var machine_feed_db_uri = cfg.ResourceAllocatorMachineFeedURI

func initiateAllDB() {

	utils.InitSQLDB(allocator_host, allocator_port, allocator_user_name, allocator_password, allocator_db_name)
	utils.SQL_db_name_mapping["resource-allocator"] = allocator_db_name

	utils.InitSQLDB(user_host, user_port, user_user_name, user_password, user_db_name)
	utils.SQL_db_name_mapping["resource-user"] = user_db_name

	utils.InitMongoDB(machine_db_uri, machine_db_name)
	utils.Mongo_db_name_mapping["resource-machine"] = machine_db_name

	utils.InitMongoDB(machine_master_db_uri, machine_master_db_name)
	utils.Mongo_db_name_mapping["resource-machine-master"] = machine_master_db_name

	utils.InitMongoDB(machine_feed_db_uri, machine_feed_db_name)
	utils.Mongo_db_name_mapping["resource-machine-feed"] = machine_feed_db_name
	fmt.Println("All DBs connected")
}

func main() {
	var wg sync.WaitGroup
	initiateAllDB()
	go runConsumer(user_consumers.UserDataConsumer(), &wg, user_consumers.RunUserDataConsumer)
	go runConsumer(machine_consumers.MachineDataConsumer(), &wg, machine_consumers.RunMachineDataConsumer)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	<-signals

	wg.Wait()

	fmt.Println("All consumers have stopped.")
}
