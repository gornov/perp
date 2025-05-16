import type Instrument from '@/stores/classes/Instrument.ts'
import useInstrumentsStore from '@/stores/instruments.ts'

export interface RawActiveTrade {
  id: number
  instrumentId: 2
  amount: number
  mult: number
  createdAt: string
  side: 'buy' | 'sell'
  accountId: number
  openRate: number
  state: 'open' | 'closed'
  quantity: number
  //
  // id: string
  symbol: string
  // alias: string
  // volume: number
  // side: 'buy' | 'sell'
  // openTime: string
  // openPrice: number
  // stopLoss: number
  // takeProfit: number
  // swap: number
  // profit: number
  // netProfit: number
  // currentPrice: number
  // commission: number
  // margin: number
}

export default class ActiveTrade {
  public id: number
  public symbol: string
  public alias: string
  public amount: number
  public mult: number
  public side: 'buy' | 'sell'
  public createdAt: string
  public openRate: number
  // public stopLoss: number
  // public takeProfit: number
  // public swap: number
  // public profit: number
  // public netProfit: number
  // public currentPrice: number
  // public commission: number
  // public margin: number
  public instrument: Instrument
  public state: RawActiveTrade['state']

  public constructor(rawActiveTrade: RawActiveTrade) {
    const instrumentsStore = useInstrumentsStore()
    this.instrument = instrumentsStore.instrumentsIdMap[rawActiveTrade.instrumentId]
    this.id = rawActiveTrade.id
    this.symbol = this.instrument.symbol
    this.alias = this.instrument.alias
    this.amount = rawActiveTrade.amount
    this.mult = rawActiveTrade.mult
    this.side = rawActiveTrade.side
    this.createdAt = rawActiveTrade.createdAt
    this.openRate = rawActiveTrade.openRate
    this.state = rawActiveTrade.state
    // this.stopLoss = rawActiveTrade.stopLoss
    // this.takeProfit = rawActiveTrade.takeProfit
    // this.swap = rawActiveTrade.swap
    // this.profit = rawActiveTrade.profit
    // this.netProfit = rawActiveTrade.netProfit
    // this.currentPrice = rawActiveTrade.currentPrice
    // this.commission = rawActiveTrade.commission
    // this.margin = rawActiveTrade.margin
  }

  public get profit(): number {
    if (!this.instrument) return 0
    const priceType = this.side == 'buy' ? 'bid' : 'ask'
    return this.getProfit(this.instrument[priceType])
  }

  protected getProfit(rate: number): number {
    if (!this.instrument) return 0
    const trend = this.side == 'buy' ? 1 : -1
    const lot = (this.amount * this.mult) / this.openRate
    return trend * lot * (rate - this.openRate)
  }
}
