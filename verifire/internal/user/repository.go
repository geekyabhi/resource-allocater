package user

import (
	"context"
	"fmt"

	"github.com/verifire/config"
	"github.com/verifire/database/mongo_db"
	"github.com/verifire/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var cnf, _ = config.Load()

type UserRespository struct {
	Collection *mongo.Collection
	DbClient   *mongo.Client
}

type User struct {
	Admin             bool   `bson:"admin"`
	Email             string `bson:"email"`
	EmailNotification bool   `bson:"email_notification"`
	FirstName         string `bson:"first_name"`
	Gender            string `bson:"gender"`
	Id                string `bson:"id"`
	LastName          string `bson:"last_name"`
	Password          string `bson:"password"`
	PhoneNumber       string `bson:"phone_number"`
	Salt              string `bson:"salt"`
	SmsNotification   bool   `bson:"sms_notification"`
	Verified          bool   `bson:"verified"`
}

func NewUserRepo() (*UserRespository, error) {
	collectionName := "users"
	dbCLient := mongo_db.ConnectionPool[cnf.VerifireDBName]
	database := dbCLient.Database(cnf.VerifireDBName)
	collection := database.Collection(collectionName)
	return &UserRespository{
		Collection: collection,
		DbClient:   dbCLient,
	}, nil
}

func (repo *UserRespository) FindUserByID(id string) (*User, error) {
	var user User
	filter := bson.M{"id": id}
	fmt.Println(filter)
	err := repo.Collection.FindOne(context.Background(), filter).Decode(&user)
	utils.Produce(err)
	return &user, nil
}

func (repo *UserRespository) FindUserByEmail(email string) (*User, error) {
	var user User
	filter := bson.M{"email": email}
	err := repo.Collection.FindOne(context.Background(), filter).Decode(&user)
	utils.Produce(err)
	return &user, nil
}
