package allocation

import (
	"context"
	"log"

	"github.com/verifire/config"
	"github.com/verifire/database/mongo_db"
	"github.com/verifire/utils"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

var cnf, _ = config.Load()

type AllocationRespository struct {
	Collection *mongo.Collection
	DbClient   *mongo.Client
}

type Allocation struct {
	ContainerId   string `bson:"container_id"`
	ContainerName string `bson:"conatiner_name"`
	IsActive      bool   `bson:"is_active"`
	MachineId     string `bson:"machine_id"`
	MachineName   string `bson:"machine_name"`
	PortUsed      int32  `bson:"port_used"`
	Status        string `bson:"status"`
	Uid           string `bson:"uid"`
}

func NewAllocationRepo() (*AllocationRespository, error) {
	collectionName := "allocations"
	dbCLient := mongo_db.ConnectionPool[cnf.VerifireDBName]
	database := dbCLient.Database(cnf.VerifireDBName)
	collection := database.Collection(collectionName)
	return &AllocationRespository{
		Collection: collection,
		DbClient:   dbCLient,
	}, nil
}

func (repo *AllocationRespository) FindAllocationByConatinerID(container_id string) (*Allocation, error) {
	var allocation Allocation
	filter := bson.M{"container_id": container_id}
	err := repo.Collection.FindOne(context.Background(), filter).Decode(&allocation)
	utils.Produce(err)
	return &allocation, nil
}

func (repo *AllocationRespository) FindAllocationByUID(uid string) ([]Allocation, error) {
	filter := bson.M{"uid": uid}
	var allocations []Allocation
	cursor, err := repo.Collection.Find(context.Background(), filter)
	defer cursor.Close(context.Background())
	for cursor.Next(context.Background()) {
		var allocation Allocation
		if err := cursor.Decode(&allocation); err != nil {
			log.Fatal(err)
		}
		allocations = append(allocations, allocation)
	}
	utils.Produce(err)
	return allocations, nil
}
