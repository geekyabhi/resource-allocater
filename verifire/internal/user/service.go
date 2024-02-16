package user

import "github.com/verifire/utils"

func FindUserByEmailService(email string) (*User, error) {
	defer utils.Handle()
	userRepo, err := NewUserRepo()
	user, err := userRepo.FindUserByEmail(email)
	utils.Produce(err)
	return user, nil
}

func FindUserByIdService(id string) (*User, error) {
	defer utils.Handle()
	userRepo, err := NewUserRepo()
	user, err := userRepo.FindUserByID(id)
	utils.Produce(err)
	return user, nil
}
