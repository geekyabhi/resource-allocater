package main

import (
	"fmt"
	"log"

	"net"

	"github.com/verifire/config"
	"github.com/verifire/database/mongo_db"
	"github.com/verifire/internal/machine"
	"github.com/verifire/internal/user"
	machinepb "github.com/verifire/protos/machine"
	userpb "github.com/verifire/protos/user"
	"google.golang.org/grpc"
)

var cnf, _ = config.Load()

func main() {
	fmt.Println()
	var config mongo_db.MongoDBConfig
	config.ConnectionString = cnf.VerifireDBURI
	config.Database = cnf.VerifireDBName
	mongo_db.InitMongoDB(config)

	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	s := grpc.NewServer()
	userpb.RegisterUserServiceServer(s, &user.Server{})
	machinepb.RegisterMachineServiceServer(s, &machine.Server{})
	log.Println("gRPC server started on port :50052")
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
