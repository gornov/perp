package config

import (
	"github.com/spf13/viper"
)

type Config struct {
	Port        string
	QuoteAPI    string
	PostgresDSN string
}

func LoadConfig() (*Config, error) {
	viper.AutomaticEnv()
	viper.SetConfigFile(".env")
	viper.SetConfigType("env")
	_ = viper.ReadInConfig()

	return &Config{
		Port:        viper.GetString("PORT"),
		QuoteAPI:    viper.GetString("QUOTE_API"),
		PostgresDSN: viper.GetString("POSTGRES_DSN"),
	}, nil
}
