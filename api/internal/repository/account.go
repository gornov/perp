package repository

import (
	"errors"
	"fmt"
	"github.com/shopspring/decimal"
	"gorm.io/gorm/clause"
	"gornov.me/engine/internal/model"

	"gorm.io/gorm"
)

type AccountRepository interface {
	CreateAccount(extID string) (*model.Account, error)
	UpdateBalance(extID string, balance string) error
	GetBalance(extID string) (decimal.Decimal, error)
	AdjustBalanceWithLock(extID string, delta decimal.Decimal) error
	FindByExtID(extID string) (*model.Account, error)
	GetAccountByExtID(extID string) (*model.Account, error)
	FindOrCreateAccountByPubKey(pubKey string) (*model.Account, error)
}

type accountRepositoryImpl struct {
	db *gorm.DB
}

func NewAccountRepository(db *gorm.DB) AccountRepository {
	return &accountRepositoryImpl{db: db}
}

func (r *accountRepositoryImpl) CreateAccount(extID string) (*model.Account, error) {
	account := &model.Account{
		ExtID:   extID,
		Balance: decimal.Zero,
	}
	err := r.db.Create(account).Error
	return account, err
}

func (r *accountRepositoryImpl) UpdateBalance(extID string, balance string) error {
	return r.db.Model(&model.Account{}).
		Where("ext_id = ?", extID).
		Update("balance", balance).
		Error
}

func (r *accountRepositoryImpl) GetBalance(extID string) (decimal.Decimal, error) {
	var account model.Account
	err := r.db.Where("ext_id = ?", extID).First(&account).Error
	if err != nil {
		return decimal.Decimal{}, err
	}
	return account.Balance, nil
}

func (r *accountRepositoryImpl) AdjustBalanceWithLock(extID string, delta decimal.Decimal) error {
	return r.db.Transaction(func(tx *gorm.DB) error {
		var account model.Account
		if err := tx.Clauses(clause.Locking{Strength: "UPDATE"}).
			Where("ext_id = ?", extID).
			First(&account).Error; err != nil {
			return err
		}

		newBalance := account.Balance.Add(delta)
		if newBalance.IsNegative() {
			return fmt.Errorf("resulting balance cannot be negative")
		}

		return tx.Model(&model.Account{}).
			Where("ext_id = ?", extID).
			Update("balance", newBalance).
			Error
	})
}

func (r *accountRepositoryImpl) FindByExtID(extID string) (*model.Account, error) {
	var account model.Account
	err := r.db.Where("ext_id = ?", extID).First(&account).Error
	return &account, err
}

func (r *accountRepositoryImpl) GetAccountByExtID(extID string) (*model.Account, error) {
	var account model.Account
	err := r.db.Where("ext_id = ?", extID).First(&account).Error
	return &account, err
}

func (r *accountRepositoryImpl) FindOrCreateAccountByPubKey(pubKey string) (*model.Account, error) {
	var account model.Account
	err := r.db.Where("ext_id = ?", pubKey).First(&account).Error
	if err == nil {
		return &account, nil
	}
	if err != nil && !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, err
	}

	account = model.Account{
		ExtID:   pubKey,
		Balance: decimal.Zero,
	}
	if err := r.db.Create(&account).Error; err != nil {
		return nil, err
	}

	return &account, nil
}
