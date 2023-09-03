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

func main() {
	var wg sync.WaitGroup

	topic1Consumer := consumers.NewTopic1Consumer()

	go runConsumer(topic1Consumer, &wg, consumers.RunTopic1Consumer)

	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	<-signals

	wg.Wait()

	fmt.Println("All consumers have stopped.")
}
