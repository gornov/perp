package usecase

import (
	"gornov.me/engine/internal/repository"

	"github.com/shopspring/decimal"
)

type AccountSummary struct {
	ExtID       string          `json:"ext_id"`
	Balance     decimal.Decimal `json:"balance"`
	TotalPL     decimal.Decimal `json:"total_pl"`
	TotalMargin decimal.Decimal `json:"total_margin"`
	FreeFunds   decimal.Decimal `json:"free_funds"`
	Equity      decimal.Decimal `json:"equity"`
	MarginLevel decimal.Decimal `json:"margin_level"`
}

type AccountSummaryUsecase interface {
	GetSummary(extID string) (*AccountSummary, error)
}

type accountSummaryUsecaseImpl struct {
	accountRepo  repository.AccountRepository
	positionRepo repository.PositionRepository
}

func NewAccountSummaryUsecase(ar repository.AccountRepository, pr repository.PositionRepository) AccountSummaryUsecase {
	return &accountSummaryUsecaseImpl{
		accountRepo:  ar,
		positionRepo: pr,
	}
}

func (u *accountSummaryUsecaseImpl) GetSummary(extID string) (*AccountSummary, error) {
	account, err := u.accountRepo.GetAccountByExtID(extID)
	if err != nil {
		return nil, err
	}

	plSum, marginSum, err := u.positionRepo.GetPositionSummaryByAccountID(account.ID)
	if err != nil {
		return nil, err
	}

	equity := account.Balance.Add(plSum).Add(marginSum)
	freeFunds := equity.Sub(marginSum)
	marginLevel := decimal.Zero
	if marginSum.Cmp(decimal.Zero) != 0 {
		marginLevel = equity.Div(marginSum).Mul(decimal.NewFromInt(100))
	}

	return &AccountSummary{
		ExtID:       account.ExtID,
		Balance:     account.Balance,
		TotalPL:     plSum,
		TotalMargin: marginSum,
		FreeFunds:   freeFunds,
		Equity:      equity,
		MarginLevel: marginLevel,
	}, nil
}
