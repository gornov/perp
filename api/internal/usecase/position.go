package usecase

import (
	"fmt"
	"gornov.me/engine/internal/model"
	"gornov.me/engine/internal/repository"
	"gornov.me/engine/internal/service"

	"github.com/shopspring/decimal"
)

const (
	PositionOpen   = "open"
	PositionClosed = "closed"
)

type PositionUsecase interface {
	CreatePosition(symbol string, amount decimal.Decimal, mult int64, sideStr string, extID string) error
	GetPositions(symbol, extID, side *string, state *string) ([]model.Position, error)
	ClosePosition(positionID int64) error
}

type QuoteGetter interface {
	GetQuote(symbol string) (string, error)
}

type positionUsecaseImpl struct {
	positionRepo   repository.PositionRepository
	accountRepo    repository.AccountRepository
	instrumentRepo repository.InstrumentRepository
	quoteGetter    QuoteGetter
	ds             *service.DealerService
}

func NewPositionUsecase(pr repository.PositionRepository, ar repository.AccountRepository, ir repository.InstrumentRepository, q QuoteGetter, ds *service.DealerService) PositionUsecase {
	return &positionUsecaseImpl{
		positionRepo:   pr,
		accountRepo:    ar,
		instrumentRepo: ir,
		quoteGetter:    q,
		ds:             ds,
	}
}

func (u *positionUsecaseImpl) CreatePosition(symbol string, margin decimal.Decimal, leverage int64, side string, extID string) error {

	if margin.Cmp(decimal.Zero) == 0 {
		return fmt.Errorf("margin is zero")
	}

	if leverage == 0 {
		return fmt.Errorf("leverage is zero")
	}

	account, err := u.accountRepo.FindByExtID(extID)
	if err != nil {
		return fmt.Errorf("account not found: %w", err)
	}

	balance, err := u.accountRepo.GetBalance(extID)
	if err != nil {
		return fmt.Errorf("could not get balance for account %s: %w", extID, err)
	}

	if balance.Cmp(margin) < 0 {
		return fmt.Errorf("insufficient balance for account: %s", extID)
	}

	instrument, err := u.instrumentRepo.FindBySymbol(symbol)
	if err != nil {
		return fmt.Errorf("instrument not found: %w", err)
	}

	openRateStr, err := u.quoteGetter.GetQuote(symbol)
	if err != nil {
		return fmt.Errorf("quote not found: %w", err)
	}
	openRate, err := decimal.NewFromString(openRateStr)
	if err != nil {
		return fmt.Errorf("invalid open rate format: %w", err)
	}

	quantity := decimal.NewFromInt(leverage).Mul(margin).Div(openRate)

	position := &model.Position{
		InstrumentID: instrument.ID,
		Margin:       margin,
		Leverage:     leverage,
		Side:         side,
		AccountID:    account.ID,
		State:        PositionOpen,
		Quantity:     quantity,
		OpenRate:     openRate,
	}

	err = u.positionRepo.CreatePosition(position)
	if err != nil {
		return fmt.Errorf("position creation failed: %w", err)
	}

	pd := service.PositionData{
		ID:         position.ID,
		OpenRate:   openRate,
		Symbol:     symbol,
		Side:       side,
		Margin:     margin,
		Quantity:   quantity,
		Leverage:   leverage,
		Instrument: instrument.Symbol,
		AccountID:  account.ID,
	}
	u.ds.AddToQueue(pd)

	return nil
}

func (u *positionUsecaseImpl) GetPositions(symbol, extID, side *string, state *string) ([]model.Position, error) {

	filter := repository.PositionFilter{
		Symbol: symbol,
		ExtID:  extID,
		Side:   side,
		State:  state,
	}

	return u.positionRepo.GetPositions(filter)
}

func (u *positionUsecaseImpl) ClosePosition(positionID int64) error {
	err := u.positionRepo.ClosePosition(positionID)
	if err != nil {
		return fmt.Errorf("position close failed: %w", err)
	}

	u.ds.DeleteFromQueue(positionID)

	return nil
}
