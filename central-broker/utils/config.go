package utils

import (
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	KafkaBrokers  string
	KafkaUsername string
	KafkaPassword string
}

func Load() (*AppConfig, error) {
	err := godotenv.Load()
	if err != nil {
		return nil, err
	}

	config := &AppConfig{
		KafkaBrokers:  os.Getenv("KAFKA_BROKERS"),
		KafkaUsername: os.Getenv("KAFKA_USERNAME"),
		KafkaPassword: os.Getenv("KAFKA_PASSWORD"),
	}

	return config, nil
}
