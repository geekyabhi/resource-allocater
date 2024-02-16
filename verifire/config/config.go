package config

import (
	"os"

	"github.com/joho/godotenv"
)

type AppConfig struct {
	VerifireDBName string
	VerifireDBURI  string
	// RsUserAddress                        string
	// RsMachineAddress                     string
	// RsAllocaterAddress                   string
	// RsFeedAddress                        string
}

func Load() (*AppConfig, error) {
	err := godotenv.Load()

	if err != nil {
		return nil, err
	}

	config := &AppConfig{
		VerifireDBName: os.Getenv("VERIFIRE_DB_NAME"),
		VerifireDBURI:  os.Getenv("VERIFIRE_DB_URI"),

		// RsUserAddress:      os.Getenv("RS_USER_ADDRESS"),
		// RsMachineAddress:   os.Getenv("RS_MACHINE_ADDRESS"),
		// RsAllocaterAddress: os.Getenv("RS_ALLOCATER_ADDRESS"),
		// RsFeedAddress:      os.Getenv("RS_FEED_ADDRESS"),
	}

	return config, nil
}

var cfg, _ = Load()
