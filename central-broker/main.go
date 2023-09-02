package main

import (
	"fmt"
	"os"
	"os/signal"
	"sync"

	"github.com/geekyabhi/resource-allocater/consumers"
	"github.com/geekyabhi/resource-allocater/utils"
)

func main() {
	// Initialize Kafka consumers for your topics
	topic1Consumer := consumers.NewTopic1Consumer()
	// Add more consumers for other topics if needed

	// Create a wait group to wait for all consumers to finish
	var wg sync.WaitGroup

	// Define a function to run a consumer and wait for it to finish
	runConsumer := func(consumer *utils.KafkaConsumer) {
		defer wg.Done()
		consumers.RunTopic1Consumer(consumer) // Change to the appropriate Run function for each topic
	}

	// Start your Kafka consumers
	wg.Add(1) // Add one for each consumer
	go runConsumer(topic1Consumer)
	// Start more consumers for other topics if needed

	// Wait for termination signals
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	// Wait for all consumers to finish or until a termination signal is received
	select {
	case <-signals:
		fmt.Println("Received termination signal. Stopping consumers...")
	}

	// Close and stop all consumers gracefully
	consumers.StopAndClose(topic1Consumer)
	// Stop and close more consumers for other topics if needed

	// Wait for all consumers to finish
	wg.Wait()

	fmt.Println("All consumers have stopped.")
}
