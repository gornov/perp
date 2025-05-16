package usecase

import (
	"gornov.me/engine/internal/model"
	"gornov.me/engine/internal/repository"

	"github.com/shopspring/decimal"
)

type AccountUsecase interface {
	CreateAccount(extID string) (*model.Account, error)
	UpdateBalance(extID string, balance decimal.Decimal) error
	GetBalance(extID string) (decimal.Decimal, error)
	AdjustBalance(extID string, delta decimal.Decimal) error
}

type accountUsecaseImpl struct {
	accountRepo repository.AccountRepository
}

func NewAccountUsecase(ar repository.AccountRepository) AccountUsecase {
	return &accountUsecaseImpl{accountRepo: ar}
}

func (u *accountUsecaseImpl) CreateAccount(extID string) (*model.Account, error) {
	return u.accountRepo.CreateAccount(extID)
}

func (u *accountUsecaseImpl) UpdateBalance(extID string, balance decimal.Decimal) error {
	return u.accountRepo.UpdateBalance(extID, balance.String())
}

func (u *accountUsecaseImpl) GetBalance(extID string) (decimal.Decimal, error) {
	balance, err := u.accountRepo.GetBalance(extID)
	if err != nil {
		return decimal.Zero, err
	}
	return balance, nil
}

func (u *accountUsecaseImpl) AdjustBalance(extID string, delta decimal.Decimal) error {
	return u.accountRepo.AdjustBalanceWithLock(extID, delta)
}
