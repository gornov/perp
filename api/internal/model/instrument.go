package model

type Instrument struct {
	ID     int64  `gorm:"primaryKey;autoIncrement" json:"id"`
	Symbol string `gorm:"uniqueIndex;not null" json:"symbol"`
	Act    bool   `gorm:"not null;default:true" json:"act"`
}

func (Instrument) TableName() string {
	return "instruments"
}
