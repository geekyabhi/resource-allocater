package utils

import (
	"fmt"

	"github.com/go-redis/redis"
)

var Redis_db_mapping map[string]*redis.Client

type RedisHelper struct {
	client *redis.Client
}

func NewRedisHelper(addr, password string, db int, db_name string) *RedisHelper {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       db,
	})
	if Redis_db_mapping == nil {
		Redis_db_mapping = make(map[string]*redis.Client)
	}
	Redis_db_mapping[db_name] = client
	return &RedisHelper{client: client}
}

func (rh *RedisHelper) SetValue(key, value string) error {
	err := rh.client.Set(key, value, 0).Err()
	if err != nil {
		return fmt.Errorf("error setting value for key %s: %v", key, err)
	}
	return nil
}

func (rh *RedisHelper) GetValue(key string) (string, error) {
	val, err := rh.client.Get(key).Result()
	if err != nil {
		return "", fmt.Errorf("error getting value for key %s: %v", key, err)
	}
	return val, nil
}

func (rh *RedisHelper) DeleteValue(key string) error {
	err := rh.client.Del(key).Err()
	if err != nil {
		return fmt.Errorf("error deleting key %s: %v", key, err)
	}
	return nil
}
