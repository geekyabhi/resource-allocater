package models

import "gorm.io/gorm"

type Eventdetail struct{
	gorm.Model
	Id string `gorm:"primaryKey;not null"`
	Event string `gorm:"unique;not null"`
	Message string `gorm:"not null"`
}