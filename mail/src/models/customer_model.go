package models

import "gorm.io/gorm"

type User struct{
	gorm.Model
	Id string `gorm:"not null"`
	SQLId string `gorm:"unique"`
	First_name string
	Last_name string
	Email string 
	Phone string `gorm:"unique"`
	SMS_Notification bool `gorm:"default:true"`
	EMAIL_Notification bool `gorm:"default:true"`
}
