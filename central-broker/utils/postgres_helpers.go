package utils

import (
	"context"
	"fmt"
	"log"
	"reflect"
	"time"

	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lib/pq"
	uuid "github.com/satori/go.uuid"
)

var pools map[string]*pgxpool.Pool
var Db_name_mapping map[string]string

func InitDB(host string, port int, user, password, dbName string) {
	if pools == nil {
		pools = make(map[string]*pgxpool.Pool)
	}

	if Db_name_mapping == nil {
		Db_name_mapping = make(map[string]string)
	}

	connStr := fmt.Sprintf("host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		host, port, user, password, dbName)

	config, err := pgxpool.ParseConfig(connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Customize pool settings if needed
	config.MaxConnLifetime = time.Minute * 5

	pool, err := pgxpool.ConnectConfig(context.Background(), config)
	if err != nil {
		log.Fatal(err)
	}

	pools[dbName] = pool
}

func GetDB(dbName string) *pgxpool.Pool {
	return pools[dbName]
}

// QueryDatabase executes a database query and returns the result set.

func QueryDatabase(pool *pgxpool.Pool, query string) ([]map[string]interface{}, error) {
	conn, err := pool.Acquire(context.Background())
	if err != nil {
		return nil, err
	}
	defer conn.Release()

	rows, err := conn.Query(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []map[string]interface{}

	columnDescriptions := rows.FieldDescriptions()

	for rows.Next() {
		columnValues := make([]interface{}, len(columnDescriptions))
		for i := range columnValues {
			columnValues[i] = new(interface{})
		}

		if err := rows.Scan(columnValues...); err != nil {
			return nil, err
		}

		row := make(map[string]interface{})
		for i, col := range columnDescriptions {
			switch reflect.TypeOf(columnValues[i]).Kind() {
			case reflect.Ptr:
				switch reflect.TypeOf(columnValues[i]).Elem().Name() {
				case "Time":
					row[string(col.Name)] = *(columnValues[i].(*time.Time))
				case "StringArray":
					row[string(col.Name)] = *(columnValues[i].(*pq.StringArray))
				default:
					row[string(col.Name)] = *(columnValues[i].(*interface{}))
				}
			default:
				row[string(col.Name)] = columnValues[i]
			}
		}

		result = append(result, row)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func PrintResult(result []map[string]interface{}) {
	for _, row := range result {
		for key, val := range row {
			fmt.Printf("%s =>>>>>>>>>>", key)
			switch v := val.(type) {
			case int:
				fmt.Print(v)
			case string:
				fmt.Print(v)
			case float64:
				fmt.Print(v)
			case []uint8:
				if key == "instance_id" || key == "uid" {
					uidBytes := make([]byte, len(v))
					for i, b := range v {
						uidBytes[i] = byte(b)
					}
					uid, err := uuid.FromBytes(uidBytes)
					if err != nil {
						fmt.Print("Error converting to UUID:", err)
					} else {
						fmt.Print(uid.String())
					}
				} else {
					fmt.Print(v)
				}
			default:
				fmt.Println("HHHHHHHHHHHHHHHHHHHHHHHHH")
				fmt.Println(reflect.TypeOf(v))
				fmt.Print(v)
			}
			fmt.Println()
		}
		fmt.Println()
	}
}