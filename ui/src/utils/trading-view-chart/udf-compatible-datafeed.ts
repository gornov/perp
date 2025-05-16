import catchApiError from '@/api/catchApiError'
import instrumentsApi from '@/api/instrumentsApi'
// import CandlesticksSocketModule from '@/app/socket/CandlesticksSocketModule'
import useInstrumentsStore from '@/stores/instruments'
import { toResolutionString } from '@/utils/trading-view-chart/parts/helpers.ts'

import type {
  Bar,
  ErrorCallback,
  HistoryCallback,
  IBasicDataFeed,
  LibrarySymbolInfo,
  OnReadyCallback,
  PeriodParams,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
  SymbolResolveExtension,
} from '@vendor/tradingview'
import type { UdfCompatibleConfiguration } from 'vendor/tradingview/datafeeds/udf/src/udf-compatible-datafeed-base'
import { watch } from 'vue'

const logMessage = (...args: unknown[]): void => {
  console.warn(...args)
}

const supported_resolutions = ['1', '5', '15', '30', '60', '240', '1D', '1W', '1M'].map(
  toResolutionString,
)

function getServerResolution(resolution: ResolutionString): QuotesResolution {
  switch (resolution) {
    case '1S':
      return '1m' // todo why?
    case '1':
      return '1m'
    case '5':
      return '5m'
    case '15':
      return '15m'
    case '30':
      return '30m'
    case '60':
      return '1h'
    case '240':
      return '4h'
    case '1D':
      return '1D'
    case '1W':
      return '1W'
    case '1M':
      return '1M'
    default:
      return '1m'
  }
}

export class UDFCompatibleDatafeed implements IBasicDataFeed {
  // private candlesticksSocketModule = CandlesticksSocketModule.getInstance()
  // private unsubscriptionMap: Record<string, () => void> = {}

  public constructor(private shouldSubscribeToUpdates = true) {}

  public onReady(callback: OnReadyCallback): void {
    logMessage('UDF', 'onReady')
    setTimeout(() =>
      callback({
        exchanges: [],
        supports_group_request: false,
        supports_marks: true,
        supports_search: true,
        symbols_types: [{ name: 'Crypto-currency', value: 'crypto' }],
        supported_resolutions,
      } as UdfCompatibleConfiguration),
    )
  }

  public async getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParams,
    onResult: HistoryCallback,
    onError: ErrorCallback,
  ): Promise<void> {
    logMessage('UDF', 'getBars', periodParams, resolution)
    const barsPerRequest = 2000
    try {
      const history = await catchApiError(() =>
        instrumentsApi.getHistoryQuotes(symbolInfo.name, getServerResolution(resolution), {
          endTime: periodParams.to * 1000,
          startTime: periodParams.from * 1000,
          // count: barsPerRequest,
        }),
      )
      onResult(
        history.map((quote: IHistoryQuote) => this.quoteToBar(quote)),
        { noData: history.length < barsPerRequest },
      )
    } catch (error: unknown) {
      onError(error instanceof Error ? error.message : String(error))
    }
  }

  public resolveSymbol(
    symbolName: string,
    onResolve: ResolveCallback,
    _onError: ErrorCallback,
    _extension: SymbolResolveExtension | undefined,
  ): void {
    logMessage('UDF', 'resolveSymbol')
    const instrument = useInstrumentsStore().instrumentsMap[symbolName]
    setTimeout(() =>
      onResolve({
        description: instrument.description,
        intraday_multipliers: ['1', '5', '15', '30', '60', '240'],
        exchange: '',
        format: 'price',
        has_intraday: true,
        has_seconds: false,
        has_weekly_and_monthly: true,
        full_name: instrument.alias,
        listed_exchange: '',
        minmov: 1,
        name: symbolName,
        pricescale: Number.isInteger(instrument.pricePrecision)
          ? Math.pow(10, instrument.pricePrecision)
          : 100,
        session: '24x7',
        supported_resolutions,
        timezone: 'Etc/UTC',
        type: 'crypto',
        session_holidays: '',
      }),
    )
  }

  public searchSymbols(
    userInput: string,
    _exchange: string,
    _symbolType: string,
    onResult: SearchSymbolsCallback,
  ): void {
    logMessage('UDF', 'searchSymbols')
    const { instruments } = useInstrumentsStore()
    userInput = userInput.toLowerCase()
    const result = instruments
      .filter(
        (instrument) =>
          instrument.symbol?.toLowerCase().includes(userInput) ||
          instrument.alias?.toLowerCase().includes(userInput) ||
          instrument.description?.toLowerCase().includes(userInput),
      )
      .map((instrument) => ({
        symbol: instrument.symbol,
        full_name: instrument.symbol,
        description:
          instrument.description?.replace(/<[^>]+>/gi, '') || instrument.alias || instrument.symbol,
        exchange: '',
        type: 'crypto',
      }))

    setTimeout(() => onResult(result))
  }

  public subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    _resolution: ResolutionString,
    onTick: SubscribeBarsCallback,
    listenerGuid: string,
    _onResetCacheNeededCallback: () => void,
  ): void {
    if (!this.shouldSubscribeToUpdates) {
      return
    }
    logMessage('UDF', 'subscribeBars', symbolInfo.name, listenerGuid)
    const instrumentStore = useInstrumentsStore()
    watch(
      () => instrumentStore.instrumentsMap[symbolInfo.name].rate,
      (rate) =>
        onTick({
          time: Date.now(),
          open: rate,
          close: rate,
          low: rate,
          high: rate,
        }),
    )

    // const subscriptionData = {
    //   symbol: symbolInfo.name,
    //   timeframe: getServerResolution(resolution),
    // }
    // this.candlesticksSocketModule.subscribe(subscriptionData, listenerGuid)
    //
    // const onEvent = ({
    //   detail: { candlesticks, timeframe, symbol },
    // }: {
    //   detail: { candlesticks: Bar[]; symbol: string; timeframe: string }
    // }) => {
    //   if (timeframe === subscriptionData.timeframe && symbol === subscriptionData.symbol) {
    //     candlesticks.forEach((candlestick) => onTick(candlestick))
    //   }
    // }
    //
    // this.candlesticksSocketModule.addEventListener('update', onEvent)
    //
    // this.unsubscriptionMap[listenerGuid] = () => {
    //   this.candlesticksSocketModule.unsubscribe(subscriptionData, listenerGuid)
    //   this.candlesticksSocketModule.removeEventListener('update', onEvent)
    //   delete this.unsubscriptionMap[listenerGuid]
    // }
  }

  public unsubscribeBars(listenerGuid: string): void {
    logMessage('UDF', 'unsubscribeBars', listenerGuid)
    // if (this.unsubscriptionMap[listenerGuid]) {
    //   this.unsubscriptionMap[listenerGuid]()
    // }
  }

  private quoteToBar(quote: IHistoryQuote): Bar {
    return {
      time: quote['openTime'],
      open: +quote['open'],
      high: +quote['high'],
      low: +quote['low'],
      close: +quote['close'],
      volume: +quote['volume'],
    }
  }
}
