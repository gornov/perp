package repository

import (
	"fmt"
	"github.com/shopspring/decimal"
	"gorm.io/gorm/clause"
	"gornov.me/engine/internal/model"

	"gorm.io/gorm"
)

type PositionFilter struct {
	Symbol *string
	ExtID  *string
	Side   *string
	State  *string
}

type PositionRepository interface {
	CreatePosition(position *model.Position) error
	GetPositions(filter PositionFilter) ([]model.Position, error)
	ClosePosition(positionID int64) error
	GetAllOpenPositionsWithSymbol() ([]PositionWithSymbol, error)
	UpdatePositionPL(positionID int64, pl decimal.Decimal) error
	GetPositionSummaryByAccountID(accountID int64) (plSum decimal.Decimal, marginSum decimal.Decimal, err error)
}

type PositionWithSymbol struct {
	model.Position
	InstrumentSymbol string `json:"symbol"`
}

type positionRepositoryImpl struct {
	db *gorm.DB
}

func NewPositionRepository(db *gorm.DB) PositionRepository {
	return &positionRepositoryImpl{db: db}
}

func (r *positionRepositoryImpl) CreatePosition(position *model.Position) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var account model.Account
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("id = ?", position.AccountID).
			First(&account).Error; err != nil {
			return fmt.Errorf("account not found: %v", err)
		}

		if account.Balance.LessThan(position.Margin) {
			return fmt.Errorf("insufficient balance: available %s, required %s", account.Balance.String(), position.Margin.String())
		}

		newBalance := account.Balance.Sub(position.Margin)
		if err := tx.Model(&model.Account{}).
			Where("id = ?", account.ID).
			Update("balance", newBalance).Error; err != nil {
			return fmt.Errorf("failed to update balance: %v", err)
		}

		if err := tx.Create(position).Error; err != nil {
			return fmt.Errorf("failed to create position: %v", err)
		}

		return nil
	})
}

func (r *positionRepositoryImpl) GetPositions(filter PositionFilter) ([]model.Position, error) {
	var positions []model.Position
	query := r.db.Model(&model.Position{}).
		Joins("JOIN instruments ON instruments.id = positions.instrument_id").
		Joins("JOIN accounts ON accounts.id = positions.account_id")

	if filter.Symbol != nil {
		query = query.Where("instruments.symbol = ?", *filter.Symbol)
	}

	if filter.ExtID != nil {
		query = query.Where("accounts.ext_id = ?", *filter.ExtID)
	}

	if filter.Side != nil {
		query = query.Where("positions.side = ?", *filter.Side)
	}

	if filter.State != nil {
		query = query.Where("positions.state = ?", *filter.State)
	}

	err := query.Find(&positions).Error
	return positions, err
}

func (r *positionRepositoryImpl) ClosePosition(positionID int64) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var position model.Position
		// Блокируем позицию для безопасного обновления
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("id = ? AND state = 'open'", positionID).
			First(&position).Error; err != nil {
			return fmt.Errorf("position not found or already closed: %v", err)
		}

		// Блокируем аккаунт
		var account model.Account
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("id = ?", position.AccountID).
			First(&account).Error; err != nil {
			return fmt.Errorf("account not found: %v", err)
		}

		// Добавляем маржу на баланс аккаунта
		newBalance := account.Balance.Add(position.Margin)
		if err := tx.Model(&model.Account{}).
			Where("id = ?", account.ID).
			Update("balance", newBalance).Error; err != nil {
			return fmt.Errorf("failed to update balance: %v", err)
		}

		// Закрываем позицию
		if err := tx.Model(&model.Position{}).
			Where("id = ?", position.ID).
			Update("state", "closed").Error; err != nil {
			return fmt.Errorf("failed to close position: %v", err)
		}

		return nil
	})
}

func (r *positionRepositoryImpl) GetAllOpenPositionsWithSymbol() ([]PositionWithSymbol, error) {
	var positions []PositionWithSymbol
	err := r.db.Table("positions").
		Select("positions.*, instruments.symbol as instrument_symbol").
		Joins("JOIN instruments ON instruments.id = positions.instrument_id").
		Where("positions.state = ?", "open").
		Scan(&positions).Error
	if err != nil {
		return nil, fmt.Errorf("failed to load open positions with symbols: %v", err)
	}
	return positions, nil
}

func (r *positionRepositoryImpl) UpdatePositionPL(positionID int64, pl decimal.Decimal) error {
	return r.db.Model(&model.Position{}).
		Where("id = ?", positionID).
		Update("pl", pl).Error
}

func (r *positionRepositoryImpl) GetPositionSummaryByAccountID(accountID int64) (plSum decimal.Decimal, marginSum decimal.Decimal, err error) {
	type result struct {
		Pl     decimal.Decimal
		Margin decimal.Decimal
	}

	var res result
	err = r.db.Model(&model.Position{}).
		Select("COALESCE(SUM(pl), 0) as pl, COALESCE(SUM(margin), 0) as margin").
		Where("account_id = ? AND state = ?", accountID, "open").
		Scan(&res).Error

	return res.Pl, res.Margin, err
}
