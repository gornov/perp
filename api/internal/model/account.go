package model

import (
	"github.com/shopspring/decimal"
	"time"
)

type Account struct {
	ID        int64           `gorm:"primaryKey;autoIncrement" json:"id"`
	ExtID     string          `gorm:"uniqueIndex;not null" json:"ext_id"`
	Balance   decimal.Decimal `gorm:"type:decimal(38,18);not null;default:0" json:"balance"`
	CreatedAt time.Time       `gorm:"type:timestamp without time zone;default:now()" json:"created_at"`
}

func (Account) TableName() string {
	return "accounts"
}
