export interface RawInstrument {
  id: number
  symbol: string
  // isSessionOpen: boolean
  // symbol: string
  // alias: string
  // baseCurrency: string
  // quoteCurrency: string
  // type: 'FOREX' | 'FOREXCFD' | 'CFD'
  // pricePrecision: number
  // volumePrecision: number
  // swapBuy: number
  // swapSell: number
  // swapType: 'PIPS' | 'PERCENTS'
  // volumeMin: number
  // volumeStep: number
  // volumeMax: number
  // commissionMin: number | null
  // contractSize: number
  // sizeOfOnePoint: number
  // multiplier: number
  // divider: number
  // leverage: number
  // bidMarkup: number
  // askMarkup: number
  // freezeLevel: number
  // stopsLevel: number
  // description: string
  // tags: string[]
  // tradingHours?: {
  //   dayNumber: number
  //   openHours: number
  //   openMinutes: number
  //   openSeconds: number
  //   closeHours: number
  //   closeMinutes: number
  //   closeSeconds: number
  // }[]
  // isFixedLeverage: false
  // terminationType: 'EXPIRATION' | null
  // terminationDate: string | null
  // sessionOpen?: boolean
}

export default class Instrument {
  public id: number
  public alias: string
  public ask: number
  public baseCurrency: string
  public bid: number
  public description: string
  // public leverage: number
  public pricePrecision: number
  public profitDayRate: number
  public quoteCurrency: string
  public rate: number
  public symbol: string

  // public volumeMax: number

  public constructor(rawInstrument: RawInstrument) {
    this.id = rawInstrument.id
    this.alias = ''
    this.baseCurrency = rawInstrument.symbol.replace(/(...).*/, '$1')
    // this.baseCurrency =
    //   rawInstrument.baseCurrency && rawInstrument.baseCurrency !== rawInstrument.quoteCurrency
    //     ? rawInstrument.baseCurrency
    //     : rawInstrument.symbol.replace(new RegExp(`${rawInstrument.quoteCurrency}$`), '')
    this.description = ''
    // this.leverage = rawInstrument.leverage
    this.pricePrecision = 3
    this.quoteCurrency = 'USDT'
    this.symbol = rawInstrument.symbol
    // this.volumeMax = rawInstrument.volumeMax

    this.ask = 0 // todo
    this.bid = 0
    this.rate = 0
    this.profitDayRate = 1000
  }

  public get profitDayPercent() {
    return this.profitDayRate ? (this.rate / this.profitDayRate - 1) * 100 : null
  }
}
