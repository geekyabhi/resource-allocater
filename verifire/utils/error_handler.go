package utils

import "fmt"

func Handle() {
	e := recover()
	if e != nil {
		fmt.Println(e)
	}
}

func Produce(err error) {
	if err != nil {
		panic(err)
	}
}
