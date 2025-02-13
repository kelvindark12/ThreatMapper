package directory

import (
	"context"
	"os"
	"strconv"
	"sync"

	"github.com/deepfence/ThreatMapper/deepfence_utils/log"
)

const (
	GlobalDirKey   = NamespaceID("global")
	NonSaaSDirKey  = NamespaceID("default")
	DatabaseDirKey = NamespaceID("database")
	NamespaceKey   = "namespace"
)

type NamespaceID string

type RedisConfig struct {
	Endpoint string
	Password string
	Database int
}

type Neo4jConfig struct {
	Endpoint string
	Username string
	Password string
}

type PostgresqlConfig struct {
	Host     string
	Port     int
	Username string
	Password string
	Database string
	SslMode  string
}

type MinioConfig struct {
	Endpoint   string
	Username   string
	Password   string
	BucketName string
	Secure     bool
	Region     string
}

type DBConfigs struct {
	Redis    *RedisConfig
	Neo4j    *Neo4jConfig
	Postgres *PostgresqlConfig
	Minio    *MinioConfig
}

type namespaceDirectory struct {
	Directory map[NamespaceID]DBConfigs
	sync.RWMutex
}

var directory namespaceDirectory

func init() {
	directory = namespaceDirectory{
		Directory: map[NamespaceID]DBConfigs{},
	}
	minioCfg := initMinio()

	saasMode := false
	saasModeOn, has := os.LookupEnv("DEEPFENCE_SAAS_MODE")
	if !has {
		log.Warn().Msg("DEEPFENCE_SAAS_MODE defaults to: off")
	} else if saasModeOn == "on" {
		saasMode = true
	}

	directory.Lock()
	if !saasMode {
		redisCfg := initRedis()
		neo4jCfg := initNeo4j()
		postgresqlCfg := initPosgresql()
		directory.Directory[NonSaaSDirKey] = DBConfigs{
			Redis:    &redisCfg,
			Neo4j:    &neo4jCfg,
			Postgres: &postgresqlCfg,
			Minio:    nil,
		}
	}

	directory.Directory[GlobalDirKey] = DBConfigs{
		Redis:    nil,
		Neo4j:    nil,
		Postgres: nil,
		Minio:    &minioCfg,
	}
	directory.Unlock()
}

func GetAllNamespaces() []NamespaceID {
	directory.RLock()
	defer directory.RUnlock()
	var namespaces []NamespaceID
	for k := range directory.Directory {
		if k != GlobalDirKey {
			namespaces = append(namespaces, k)
		}
	}
	return namespaces
}

func GetDatabaseConfig(ctx context.Context) (*DBConfigs, error) {
	ns, err := ExtractNamespace(ctx)
	if err != nil {
		return nil, err
	}

	directory.RLock()
	defer directory.RUnlock()

	cfg, found := directory.Directory[ns]
	if !found {
		return nil, ErrNamespaceNotFound
	}
	return &cfg, nil
}

func ForEachNamespace(applyFn func(ctx context.Context) (string, error)) {
	namespaces := GetAllNamespaces()
	var err error
	var msg string
	for _, ns := range namespaces {
		msg, err = applyFn(NewContextWithNameSpace(ns))
		if err != nil {
			log.Error().Err(err).Msg(msg)
		}
	}
}

func FetchNamespace(email string) NamespaceID {
	namespaces := GetAllNamespaces()
	if len(namespaces) == 1 && namespaces[0] == NonSaaSDirKey {
		return NonSaaSDirKey
	} else { //nolint:staticcheck
		// TODO: Fetch namespace for SaaS tenant
	}
	return ""
}

func IsNonSaaSDeployment() bool {
	namespaces := GetAllNamespaces()
	if len(namespaces) == 1 && namespaces[0] == NonSaaSDirKey {
		return true
	}
	return false
}

func initRedis() RedisConfig {
	redisHost, has := os.LookupEnv("DEEPFENCE_REDIS_HOST")
	if !has {
		redisHost = "localhost"
		log.Warn().Msgf("DEEPFENCE_REDIS_HOST defaults to: %v", redisHost)
	}
	redisPort, has := os.LookupEnv("DEEPFENCE_REDIS_PORT")
	if !has {
		redisPort = "6379"
		log.Warn().Msgf("DEEPFENCE_REDIS_PORT defaults to: %v", redisPort)
	}
	redisEndpoint := redisHost + ":" + redisPort
	redisPassword := os.Getenv("DEEPFENCE_REDIS_PASSWORD")
	redisDBNumber := 0
	var err error
	redisDBNumberStr := os.Getenv("DEEPFENCE_REDIS_DB_NUMBER")
	if redisDBNumberStr != "" {
		redisDBNumber, err = strconv.Atoi(redisDBNumberStr)
		if err != nil {
			redisDBNumber = 0
		}
	}
	return RedisConfig{
		Endpoint: redisEndpoint,
		Password: redisPassword,
		Database: redisDBNumber,
	}
}

func initMinio() MinioConfig {
	minioHost, has := os.LookupEnv("DEEPFENCE_MINIO_HOST")
	if !has {
		minioHost = "deepfence-file-server"
		log.Warn().Msgf("DEEPFENCE_MINIO_HOST defaults to: %v", minioHost)
	}
	minioPort, has := os.LookupEnv("DEEPFENCE_MINIO_PORT")
	if !has {
		minioPort = "9000"
		log.Warn().Msgf("DEEPFENCE_MINIO_PORT defaults to: %v", minioPort)
	}

	minioUser := os.Getenv("DEEPFENCE_MINIO_USER")
	if minioUser == "" {
		minioUser = "deepfence"
		log.Warn().Msgf("DEEPFENCE_MINIO_USER defaults to: %v", minioUser)
	}
	minioPassword := os.Getenv("DEEPFENCE_MINIO_PASSWORD")
	if minioPassword == "" {
		minioPassword = "deepfence"
		log.Warn().Msg("using default minio password")
	}
	minioBucket := os.Getenv("DEEPFENCE_MINIO_BUCKET")
	minioRegion := os.Getenv("DEEPFENCE_MINIO_REGION")
	minioSecure := os.Getenv("DEEPFENCE_MINIO_SECURE")

	minioEndpoint := minioHost
	if minioHost != "s3.amazonaws.com" {
		minioEndpoint = minioHost + ":" + minioPort
	}

	if minioSecure == "" {
		minioSecure = "false"
	}
	isSecure, err := strconv.ParseBool(minioSecure)
	if err != nil {
		isSecure = false
		log.Warn().Msgf("DEEPFENCE_MINIO_SECURE defaults to: %v (%v)", isSecure, err.Error())
	}
	return MinioConfig{
		Endpoint:   minioEndpoint,
		Username:   minioUser,
		Password:   minioPassword,
		BucketName: minioBucket,
		Secure:     isSecure,
		Region:     minioRegion,
	}
}

func initPosgresql() PostgresqlConfig {
	var err error
	postgresHost, has := os.LookupEnv("DEEPFENCE_POSTGRES_USER_DB_HOST")
	if !has {
		postgresHost = "localhost"
		log.Warn().Msgf("DEEPFENCE_POSTGRES_USER_DB_HOST defaults to: %v", postgresHost)
	}
	postgresPort := 5432
	postgresPortStr := os.Getenv("DEEPFENCE_POSTGRES_USER_DB_PORT")
	if postgresPortStr == "" {
		log.Warn().Msgf("DEEPFENCE_POSTGRES_USER_DB_PORT defaults to: %d", postgresPort)
	} else {
		postgresPort, err = strconv.Atoi(postgresPortStr)
		if err != nil {
			postgresPort = 5432
		}
	}
	postgresUsername := os.Getenv("DEEPFENCE_POSTGRES_USER_DB_USER")
	if postgresUsername == "" {
		postgresUsername = "deepfence"
		log.Warn().Msgf("DEEPFENCE_POSTGRES_USER_DB_USER defaults to: %v", postgresUsername)
	}
	postgresPassword := os.Getenv("DEEPFENCE_POSTGRES_USER_DB_PASSWORD")
	if postgresPassword == "" {
		postgresPassword = "deepfence"
		log.Warn().Msg("using default postgres password")
	}
	postgresDatabase := os.Getenv("DEEPFENCE_POSTGRES_USER_DB_NAME")
	postgresSslMode := os.Getenv("DEEPFENCE_POSTGRES_USER_DB_SSLMODE")

	return PostgresqlConfig{
		Host:     postgresHost,
		Port:     postgresPort,
		Username: postgresUsername,
		Password: postgresPassword,
		Database: postgresDatabase,
		SslMode:  postgresSslMode,
	}
}

func initNeo4j() Neo4jConfig {
	neo4jHost, has := os.LookupEnv("DEEPFENCE_NEO4J_HOST")
	if !has {
		neo4jHost = "localhost"
		log.Warn().Msgf("DEEPFENCE_NEO4J_HOST defaults to: %v", neo4jHost)
	}
	neo4jBoltPort, has := os.LookupEnv("DEEPFENCE_NEO4J_BOLT_PORT")
	if !has {
		neo4jBoltPort = "7687"
		log.Warn().Msgf("DEEPFENCE_NEO4J_BOLT_PORT defaults to: %v", neo4jBoltPort)
	}
	neo4jEndpoint := "bolt://" + neo4jHost + ":" + neo4jBoltPort
	neo4jUsername := os.Getenv("DEEPFENCE_NEO4J_USER")
	if neo4jUsername == "" {
		neo4jUsername = "neo4j"
		log.Warn().Msgf("DEEPFENCE_NEO4J_USER defaults to: %v", neo4jUsername)
	}
	neo4jPassword := os.Getenv("DEEPFENCE_NEO4J_PASSWORD")
	if neo4jPassword == "" {
		neo4jPassword = "e16908ffa5b9f8e9d4ed"
		log.Warn().Msg("using default neo4j password")
	}
	return Neo4jConfig{
		Endpoint: neo4jEndpoint,
		Username: neo4jUsername,
		Password: neo4jPassword,
	}
}
