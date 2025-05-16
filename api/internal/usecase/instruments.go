package usecase

import (
	"gornov.me/engine/internal/model"
	"gornov.me/engine/internal/repository"
)

type InstrumentUsecase interface {
	GetActiveInstruments() ([]model.Instrument, error)
}

type instrumentUsecaseImpl struct {
	instrumentRepo repository.InstrumentRepository
}

func NewInstrumentUsecase(repo repository.InstrumentRepository) InstrumentUsecase {
	return &instrumentUsecaseImpl{instrumentRepo: repo}
}

func (u *instrumentUsecaseImpl) GetActiveInstruments() ([]model.Instrument, error) {
	return u.instrumentRepo.GetActiveInstruments()
}
