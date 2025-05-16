import { config } from '@/utils/trading-view-chart/parts/config'
import { UDFCompatibleDatafeed } from '@/utils/trading-view-chart/udf-compatible-datafeed.ts'
import type { ChartingLibraryWidgetOptions } from '@vendor/tradingview'

export function createWidgetOptions(
  container: HTMLElement,
  symbol: string,
  chartType: ChartType,
  locale: string,
) {
  const shouldSubscribeToUpdates = chartType != 'closedTrade'
  const datafeed = new UDFCompatibleDatafeed(shouldSubscribeToUpdates)
  return disableAllVolumeDependentStudies({
    container,
    symbol,
    datafeed,
    locale,
    ...config, // TODO Different config depending on chartType when design is ready
  } as ChartingLibraryWidgetOptions)
}

function disableAllVolumeDependentStudies(
  options: ChartingLibraryWidgetOptions,
): ChartingLibraryWidgetOptions {
  return {
    ...options,
    studies_access: {
      type: 'black',
      tools: [
        'Accumulation/Distribution',
        'Chaikin Money Flow',
        'CMF',
        'Chaikin Oscillator',
        'Ease Of Movement',
        'EOM',
        "Elder's Force Index",
        'Elders Force Index',
        'EFI',
        'Klinger Oscillator',
        'Money Flow Index',
        'MFI',
        'Net Volume',
        'On Balance Volume',
        'OBV',
        'Price Volume Trend',
        'price_volume_trend',
        'PVT',
        'Volume',
        'Volume Oscillator',
        'Volume Profile Visible Range',
        'VbPVisible',
        'VWMA',
        'VWAP',
      ].map((name) => ({ name })),
    },
  }
}
