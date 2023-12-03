package utils

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"time"

	_ "github.com/go-sql-driver/mysql"
)

var mysql_pools map[string]*sql.DB
var SQL_db_name_mapping map[string]string

func InitSQLDB(host string, port int, user, password, dbName string) {
	if mysql_pools == nil {
		mysql_pools = make(map[string]*sql.DB)
	}

	if SQL_db_name_mapping == nil {
		SQL_db_name_mapping = make(map[string]string)
	}

	// Build MySQL connection string
	connStr := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s",
		user, password, host, port, dbName)

	// Open a connection to MySQL
	db, err := sql.Open("mysql", connStr)
	if err != nil {
		log.Fatal(err)
	}

	// Customize connection settings if needed
	db.SetMaxOpenConns(10)
	db.SetMaxIdleConns(5)
	db.SetConnMaxLifetime(time.Minute * 5)

	// Verify the connection
	if err := db.Ping(); err != nil {
		log.Fatal(err)
	}

	mysql_pools[dbName] = db
}

func GetSQLDB(dbName string) *sql.DB {
	return mysql_pools[dbName]
}

// QueryDatabase executes a database query and returns the result set.
func QuerySQLDatabase(pool *sql.DB, query string) ([]map[string]interface{}, error) {
	rows, err := pool.QueryContext(context.Background(), query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []map[string]interface{}

	columnNames, err := rows.Columns()
	if err != nil {
		return nil, err
	}

	columnValues := make([]interface{}, len(columnNames))
	columnPointers := make([]interface{}, len(columnNames))
	for i := range columnValues {
		columnPointers[i] = &columnValues[i]
	}

	for rows.Next() {
		err := rows.Scan(columnPointers...)
		if err != nil {
			return nil, err
		}

		row := make(map[string]interface{})
		for i, colName := range columnNames {
			val := columnValues[i]
			switch v := val.(type) {
			case int64:
				row[colName] = v
			case float64:
				row[colName] = v
			case string:
				row[colName] = string(v)
			case []byte:
				row[colName] = string(v)
			case bool:
				row[colName] = v
			default:
				row[colName] = v

			}
		}

		result = append(result, row)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return result, nil
}

func PrintSQLResult(result []map[string]interface{}) {
	for _, row := range result {
		for key, val := range row {
			fmt.Printf("%s    ----------------->    ", key)
			switch v := val.(type) {
			case int64:
				fmt.Print(v)
			case string:
				fmt.Print(v)
			case float64:
				fmt.Print(v)
			default:
				fmt.Print(v)
			}
			fmt.Println()
		}
		fmt.Println()
	}
}
