package main

import (
	"gornov.me/engine/internal/config"
	"gornov.me/engine/internal/handler"
	"gornov.me/engine/internal/logger"
	"gornov.me/engine/internal/middleware"
	"gornov.me/engine/internal/repository"
	"gornov.me/engine/internal/service"
	"gornov.me/engine/internal/usecase"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

func main() {
	cfg, err := config.LoadConfig()
	if err != nil {
		panic(err)
	}

	log := logger.NewLogger()

	db, err := gorm.Open(postgres.Open(cfg.PostgresDSN), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect to db: %v", err)
	}

	r := gin.Default()

	candleUsecase := usecase.NewCandleUsecase(cfg.QuoteAPI)
	candleHandler := handler.NewCandleHandler(candleUsecase)

	quoteUsecase := usecase.NewQuoteUsecase(cfg.QuoteAPI)
	quoteHandler := handler.NewQuoteHandler(quoteUsecase)

	instrumentRepo := repository.NewInstrumentRepository(db)
	instrumentUsecase := usecase.NewInstrumentUsecase(instrumentRepo)
	instrumentHandler := handler.NewInstrumentHandler(instrumentUsecase)

	accountRepo := repository.NewAccountRepository(db)
	accountUsecase := usecase.NewAccountUsecase(accountRepo)
	accountHandler := handler.NewAccountHandler(accountUsecase)

	quotesService := service.NewQuotesService(cfg.QuoteAPI, instrumentRepo)
	quotesService.Start()
	memQuoteHandler := handler.NewMemQuoteHandler(quotesService)

	positionRepo := repository.NewPositionRepository(db)

	dealerService, err := service.NewDealerService(quotesService, positionRepo)
	if err != nil {
		log.Fatalf("failed to init dealer service: %v", err)
	}
	dealerService.Start()

	positionUsecase := usecase.NewPositionUsecase(positionRepo, accountRepo, instrumentRepo, quotesService, dealerService)
	positionHandler := handler.NewPositionHandler(positionUsecase)

	accountSummaryUsecase := usecase.NewAccountSummaryUsecase(accountRepo, positionRepo)
	accountSummaryHandler := handler.NewAccountSummaryHandler(accountSummaryUsecase)

	authService := service.NewAuthService()
	authHandler := handler.NewAuthHandler(authService, accountRepo)

	r.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"*"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Authorization", "Content-Type"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}))

	v1 := r.Group("/api/v1")

	v1.POST("/auth/nonce", authHandler.GenerateNonce)
	v1.POST("/auth/verify", authHandler.VerifySignature)
	v1.GET("/candles", candleHandler.GetCandles)
	v1.GET("/quote", quoteHandler.GetQuote)
	v1.GET("/memquote", memQuoteHandler.GetQuote)
	v1.GET("/instruments", instrumentHandler.GetActiveInstruments)

	protected := v1.Group("/")
	protected.Use(middleware.AuthMiddleware(authService))

	//protected.POST("/account", accountHandler.CreateAccount)
	protected.POST("/account/balance", accountHandler.UpdateBalance)
	protected.GET("/account/balance", accountHandler.GetBalance)
	protected.POST("/account/balance/adjust", accountHandler.AdjustBalance)
	protected.GET("/positions", positionHandler.GetPositions)
	protected.POST("/position", positionHandler.CreatePosition)
	protected.POST("/position/close", positionHandler.ClosePosition)
	protected.GET("/account/summary", accountSummaryHandler.GetSummary)

	log.Infof("Starting server on port %s", cfg.Port)
	r.Run(":" + cfg.Port)
}
