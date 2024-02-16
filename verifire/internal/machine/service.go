package machine

import (
	"github.com/verifire/utils"
)

func FindMachineByIdService(id string) (*Machine, error) {
	defer utils.Handle()
	machineRepo, err := NewUserRepo()
	machine, err := machineRepo.FindMachineByID(id)
	utils.Produce(err)
	return machine, nil
}
