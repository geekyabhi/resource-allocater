package utils

import (
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	KafkaBrokers                         string
	KafkaUsername                        string
	KafkaPassword                        string
	ResourceAllocatorUserDbName          string
	ResourceAllocatorUserUserName        string
	ResourceAllocatorUserHost            string
	ResourceAllocatorUserPassword        string
	ResourceAllocatorAllocatorDbName     string
	ResourceAllocatorAllocatorUserName   string
	ResourceAllocatorAllocatorHost       string
	ResourceAllocatorAllocatorPassword   string
	ResourceAllocatorUserPort            int
	ResourceAllocatorAllocatorPort       int
	ResourceAllocatorMachineDbName       string
	ResourceAllocatorMachineURI          string
	ResourceAllocatorMachinePort         int
	ResourceAllocatorMachineMasterDbName string
	ResourceAllocatorMachineMasterURI    string
	ResourceAllocatorMachineFeedDbName   string
	ResourceAllocatorMachineFeedURI      string
}

func Load() (*AppConfig, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	config := &AppConfig{
		KafkaBrokers:                  os.Getenv("KAFKA_BROKERS"),
		ResourceAllocatorUserDbName:   os.Getenv("RESOURCE_ALLOCATOR_USER_DB_NAME"),
		ResourceAllocatorUserUserName: os.Getenv("RESOURCE_ALLOCATOR_USER_USER_NAME"),
		ResourceAllocatorUserHost:     os.Getenv("RESOURCE_ALLOCATOR_USER_HOST"),
		ResourceAllocatorUserPassword: os.Getenv("RESOURCE_ALLOCATOR_USER_PASSWORD"),
		// ResourceAllocatorUserPort:     os.Getenv("RESOURCE_ALLOCATOR_USER_PORT"),
		ResourceAllocatorUserPort: 3306,

		ResourceAllocatorAllocatorDbName:   os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_DB_NAME"),
		ResourceAllocatorAllocatorUserName: os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_USER_NAME"),
		ResourceAllocatorAllocatorHost:     os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_HOST"),
		ResourceAllocatorAllocatorPassword: os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_PASSWORD"),
		// ResourceAllocatorAllocatorPort:     os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_PORT"),
		ResourceAllocatorAllocatorPort: 3306,

		ResourceAllocatorMachineDbName: os.Getenv("RESOURCE_ALLOCATOR_MACHINE_DB_NAME"),
		ResourceAllocatorMachineURI:    os.Getenv("RESOURCE_ALLOCATOR_MACHINE_URI"),

		ResourceAllocatorMachineMasterDbName: os.Getenv("RESOURCE_ALLOCATOR_MACHINE_MASTER_DB_NAME"),
		ResourceAllocatorMachineMasterURI:    os.Getenv("RESOURCE_ALLOCATOR_MACHINE_MASTER_URI"),

		ResourceAllocatorMachineFeedDbName: os.Getenv("RESOURCE_ALLOCATOR_MACHINE_FEED_DB_NAME"),
		ResourceAllocatorMachineFeedURI:    os.Getenv("RESOURCE_ALLOCATOR_MACHINE_FEED_URI"),
	}

	return config, nil
}

var cfg, _ = Load()
