package allocation

import "github.com/verifire/utils"

func FindAllocationByConatinerIdService(container_id string) (*Allocation, error) {
	defer utils.Handle()
	allocationRepo, err := NewAllocationRepo()
	allocation, err := allocationRepo.FindAllocationByConatinerID(container_id)
	utils.Produce(err)
	return allocation, nil
}

func FindAllocationByUIDService(container_id string) ([]Allocation, error) {
	defer utils.Handle()
	allocationRepo, err := NewAllocationRepo()
	allocations, err := allocationRepo.FindAllocationByUID(container_id)
	utils.Produce(err)
	return allocations, nil
}
