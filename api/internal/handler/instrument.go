package handler

import (
	"gornov.me/engine/internal/usecase"
	"net/http"

	"github.com/gin-gonic/gin"
)

type InstrumentHandler struct {
	instrumentUsecase usecase.InstrumentUsecase
}

func NewInstrumentHandler(iu usecase.InstrumentUsecase) *InstrumentHandler {
	return &InstrumentHandler{instrumentUsecase: iu}
}

func (h *InstrumentHandler) GetActiveInstruments(c *gin.Context) {
	instruments, err := h.instrumentUsecase.GetActiveInstruments()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, instruments)
}
