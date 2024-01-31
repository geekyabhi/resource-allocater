package main

import (
	"fmt"
	"os"
	"os/signal"
	"sync"

	allocation_consumers "github.com/geekyabhi/resource-allocater/consumers/allocation-data-consumer"
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

var verifire_db_name = cfg.VerifireDBName
var verifire_db_uri = cfg.VerifireDBURI

// var rs_user_address = cfg.RsUserAddress
// var rs_machine_address = cfg.RsMachineAddress
// var rs_allocater_address = cfg.RsAllocaterAddress
// var rs_feed_address = cfg.RsFeedAddress

func initiateAllDB() {
	utils.InitMongoDB(verifire_db_uri, verifire_db_name)
	fmt.Println("All DBs connected")
}

func initiateAllCache() {
	fmt.Println(utils.Redis_db_mapping)
}

func main() {
	var wg sync.WaitGroup
	initiateAllDB()
	initiateAllCache()
	go runConsumer(user_consumers.UserDataConsumer(), &wg, user_consumers.RunUserDataConsumer)
	go runConsumer(machine_consumers.MachineDataConsumer(), &wg, machine_consumers.RunMachineDataConsumer)
	go runConsumer(allocation_consumers.AllocationDataConsumer(), &wg, allocation_consumers.RunAllocationDataConsumer)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	<-signals

	wg.Wait()

	fmt.Println("All consumers have stopped.")
}
