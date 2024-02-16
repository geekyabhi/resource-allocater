package utils

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var MONGO_DB_POOL map[string]*mongo.Client

func InitMongoDB(connectionString, dbName string) {
	if MONGO_DB_POOL == nil {
		MONGO_DB_POOL = make(map[string]*mongo.Client)
	}

	clientOptions := options.Client().ApplyURI(connectionString)

	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	MONGO_DB_POOL[dbName] = client
}

func GetMongoDBClient(dbName string) *mongo.Client {
	return MONGO_DB_POOL[dbName]
}

func InsertOne(dbName, collectionName string, document interface{}) (*mongo.InsertOneResult, error) {
	client := GetMongoDBClient(dbName)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	collection := client.Database(dbName).Collection(collectionName)
	result, err := collection.InsertOne(ctx, document)
	fmt.Println(result)
	if err != nil {
		fmt.Println(err)
		return nil, err
	}

	return result, nil
}

func UpdateOne(dbName, collectionName string, filter, update interface{}, realDBName ...string) (*mongo.UpdateResult, error) {

	client := GetMongoDBClient(dbName)

	// Set up a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	fmt.Println(dbName)
	collection := client.Database(dbName).Collection(collectionName)

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func DeleteOne(dbName, collectionName string, filter interface{}, realDBName ...string) (*mongo.DeleteResult, error) {
	client := GetMongoDBClient(dbName)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	var targetDBName string
	if len(realDBName) > 0 && realDBName[0] != "" {
		targetDBName = realDBName[0]
	} else {
		targetDBName = dbName
	}

	collection := client.Database(targetDBName).Collection(collectionName)

	// Perform a delete operation
	result, err := collection.DeleteOne(ctx, filter)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func Find(dbName, collectionName string, filter interface{}) ([]map[string]interface{}, error) {
	// Set up a context with a timeout

	client := GetMongoDBClient(dbName)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Access a MongoDB collection
	collection := client.Database(dbName).Collection(collectionName)

	// Perform a find operation
	cur, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cur.Close(ctx)

	var result []map[string]interface{}

	for cur.Next(ctx) {
		var doc map[string]interface{}
		err := cur.Decode(&doc)
		if err != nil {
			return nil, err
		}
		result = append(result, doc)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func PrintMongoResult(result []map[string]interface{}) {
	for _, row := range result {
		for key, val := range row {
			fmt.Printf("%s    ----------------->    %v\n", key, val)
		}
		fmt.Println()
	}
}
