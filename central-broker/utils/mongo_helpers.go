package utils

import (
	"context"
	"fmt"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

var mongoClients map[string]*mongo.Client
var Mongo_db_name_mapping map[string]string

func InitMongoDB(connectionString, dbName string) {
	if mongoClients == nil {
		mongoClients = make(map[string]*mongo.Client)
	}

	if Mongo_db_name_mapping == nil {
		Mongo_db_name_mapping = make(map[string]string)
	}

	// Set up client options
	clientOptions := options.Client().ApplyURI(connectionString)

	// Create a new MongoDB client
	client, err := mongo.NewClient(clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	// Set up a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Connect to MongoDB
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}

	// Verify the connection
	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal(err)
	}

	mongoClients[dbName] = client
}

func GetMongoDBClient(dbName string) *mongo.Client {
	return mongoClients[dbName]
}

// QueryMongoDB executes a database query and returns the result set.

func InsertOne(dbName, collectionName string, document interface{}) (*mongo.InsertOneResult, error) {
	// Set up a context with a timeout

	client := GetMongoDBClient(dbName)
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	// Access a MongoDB collection
	collection := client.Database(dbName).Collection(collectionName)

	// Perform an insert operation
	result, err := collection.InsertOne(ctx, document)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func UpdateOne(dbName, collectionName string, filter, update interface{}) (*mongo.UpdateResult, error) {

	client := GetMongoDBClient(dbName)

	// Set up a context with a timeout
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Access a MongoDB collection
	collection := client.Database(dbName).Collection(collectionName)

	// Perform an update operation
	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return nil, err
	}

	return result, nil
}

func DeleteOne(dbName, collectionName string, filter interface{}) (*mongo.DeleteResult, error) {
	client := GetMongoDBClient(dbName)

	// Set up a context with a timeout

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// Access a MongoDB collection
	collection := client.Database(dbName).Collection(collectionName)

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
