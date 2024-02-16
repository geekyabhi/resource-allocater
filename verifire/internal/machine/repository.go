package machine

import (
	"context"
	"time"

	"github.com/verifire/config"
	"github.com/verifire/database/mongo_db"
	"github.com/verifire/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var cnf, _ = config.Load()

type MachineRespository struct {
	Collection *mongo.Collection
	DbClient   *mongo.Client
}

type Machine struct {
	BackGroundImage string                 `bson:"backGroundImage"`
	CreatedAt       time.Time              `bson:"createdAt"`
	DefaultPort     int32                  `bson:"default_port"`
	Image           string                 `bson:"image"`
	ImageName       string                 `bson:"image_name"`
	IsActive        bool                   `bson:"isactive"`
	MachineId       string                 `bson:"machine_id"`
	Name            string                 `bson:"name"`
	Props           map[string]interface{} `bson:"props"`
	UpdatedAt       time.Time              `bson:"updatedAt"`
}

func NewUserRepo() (*MachineRespository, error) {
	collectionName := "machines"
	dbCLient := mongo_db.ConnectionPool[cnf.VerifireDBName]
	database := dbCLient.Database(cnf.VerifireDBName)
	collection := database.Collection(collectionName)
	return &MachineRespository{
		Collection: collection,
		DbClient:   dbCLient,
	}, nil
}

func (repo *MachineRespository) FindMachineByID(machine_id string) (*Machine, error) {
	var user Machine
	filter := bson.M{"machine_id": machine_id}
	err := repo.Collection.FindOne(context.Background(), filter).Decode(&user)
	utils.Produce(err)
	return &user, nil
}
