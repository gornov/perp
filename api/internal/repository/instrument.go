package repository

import (
	"gornov.me/engine/internal/model"

	"gorm.io/gorm"
)

type InstrumentRepository interface {
	GetActiveInstruments() ([]model.Instrument, error)
	FindBySymbol(symbol string) (*model.Instrument, error)
}

type instrumentRepositoryImpl struct {
	db *gorm.DB
}

func NewInstrumentRepository(db *gorm.DB) InstrumentRepository {
	return &instrumentRepositoryImpl{db: db}
}

func (r *instrumentRepositoryImpl) GetActiveInstruments() ([]model.Instrument, error) {
	var instruments []model.Instrument
	err := r.db.Where("act = ?", true).Find(&instruments).Error
	return instruments, err
}

func (r *instrumentRepositoryImpl) FindBySymbol(symbol string) (*model.Instrument, error) {
	var instrument model.Instrument
	err := r.db.Where("symbol = ? AND act = true", symbol).First(&instrument).Error
	return &instrument, err
}
