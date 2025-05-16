const HistoryQuote = {
  time: 'openTime',
  openPrice: 'open',
  highPrice: 'high',
  lowPrice: 'low',
  closePrice: 'close',
  volume: 'volume',
} as const

interface IHistoryQuote {
  [HistoryQuote.time]: EpochTimeStamp
  [HistoryQuote.highPrice]: string
  [HistoryQuote.lowPrice]: string
  [HistoryQuote.openPrice]: string
  [HistoryQuote.closePrice]: string
  [HistoryQuote.volume]: string
}

interface IHistoryQuotes {
  history: IHistoryQuote[]
}

type QuotesResolution = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1D' | '1W' | '1M'
