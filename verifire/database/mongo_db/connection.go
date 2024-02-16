// internal/auth/mongodb.go

package mongo_db

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var ConnectionPool map[string]*mongo.Client

type MongoDBConfig struct {
	ConnectionString string
	Database         string
}

func InitMongoDB(config MongoDBConfig) (*mongo.Client, error) {
	clientOptions := options.Client().ApplyURI(config.ConnectionString)

	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
		return nil, err
	}

	fmt.Println("Connected to MongoDB!")
	if ConnectionPool == nil {
		ConnectionPool = make(map[string]*mongo.Client)
	}
	ConnectionPool[config.Database] = client
	return client, nil
}
