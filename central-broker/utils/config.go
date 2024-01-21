package utils

import (
	"os"
	"strconv"

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
	RsUserAddress                        string
	RsMachineAddress                     string
	RsAllocaterAddress                   string
	RsFeedAddress                        string
}

func Load() (*AppConfig, error) {
	err := godotenv.Load()

	user_port, err := strconv.Atoi(os.Getenv("RESOURCE_ALLOCATOR_USER_PORT"))
	allocater_port, err := strconv.Atoi(os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_PORT"))

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
		ResourceAllocatorUserPort: user_port,

		ResourceAllocatorAllocatorDbName:   os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_DB_NAME"),
		ResourceAllocatorAllocatorUserName: os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_USER_NAME"),
		ResourceAllocatorAllocatorHost:     os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_HOST"),
		ResourceAllocatorAllocatorPassword: os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_PASSWORD"),
		// ResourceAllocatorAllocatorPort:     os.Getenv("RESOURCE_ALLOCATOR_ALLOCATOR_PORT"),
		ResourceAllocatorAllocatorPort: allocater_port,

		ResourceAllocatorMachineDbName: os.Getenv("RESOURCE_ALLOCATOR_MACHINE_DB_NAME"),
		ResourceAllocatorMachineURI:    os.Getenv("RESOURCE_ALLOCATOR_MACHINE_URI"),

		ResourceAllocatorMachineMasterDbName: os.Getenv("RESOURCE_ALLOCATOR_MACHINE_MASTER_DB_NAME"),
		ResourceAllocatorMachineMasterURI:    os.Getenv("RESOURCE_ALLOCATOR_MACHINE_MASTER_URI"),

		ResourceAllocatorMachineFeedDbName: os.Getenv("RESOURCE_ALLOCATOR_MACHINE_FEED_DB_NAME"),
		ResourceAllocatorMachineFeedURI:    os.Getenv("RESOURCE_ALLOCATOR_MACHINE_FEED_URI"),
		RsUserAddress:                      os.Getenv("RS_USER_ADDRESS"),
		RsMachineAddress:                   os.Getenv("RS_MACHINE_ADDRESS"),
		RsAllocaterAddress:                 os.Getenv("RS_ALLOCATER_ADDRESS"),
		RsFeedAddress:                      os.Getenv("RS_FEED_ADDRESS"),
	}

	return config, nil
}

var cfg, _ = Load()
