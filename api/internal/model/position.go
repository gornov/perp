package model

import (
	"time"

	"github.com/shopspring/decimal"
)

type Position struct {
	ID           int64           `gorm:"primaryKey;autoIncrement" json:"id"`
	InstrumentID int64           `gorm:"not null" json:"instrument_id"`
	Margin       decimal.Decimal `gorm:"type:decimal(38,18);not null" json:"amount"`
	Leverage     int64           `gorm:"not null" json:"mult"`
	CreatedAt    time.Time       `gorm:"type:timestamp without time zone;default:now()" json:"created_at"`
	Side         string          `gorm:"type:side_type;not null" json:"side"` // 'buy' или 'sell'
	AccountID    int64           `gorm:"not null" json:"account_id"`
	OpenRate     decimal.Decimal `gorm:"type:decimal(38,18);not null" json:"open_rate"`
	State        string          `gorm:"type:position_state;not null;default:'open'" json:"state"`
	Quantity     decimal.Decimal `gorm:"type:decimal(38,18);not null" json:"quantity"`
}

func (Position) TableName() string {
	return "positions"
}
