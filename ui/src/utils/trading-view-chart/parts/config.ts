import { features } from '@/utils/trading-view-chart/parts/features'
import { toResolutionString } from '@/utils/trading-view-chart/parts/helpers.ts'
import { styles } from '@/utils/trading-view-chart/parts/styles'
import type { ChartingLibraryWidgetOptions } from '@vendor/tradingview'

const isDebugEnabled = false
const logMessage = (...args: unknown[]): void => {
  if (isDebugEnabled) {
    console.warn(...args)
  }
}

export const config: Partial<ChartingLibraryWidgetOptions> = {
  ...features,
  ...styles,
  autosize: true,
  interval: toResolutionString('5'),
  library_path: '/charting_library/',
  settings_adapter: {
    initialSettings: {},
    setValue(key: string, value: string) {
      logMessage('settings_adapter set', key, value)
    },
    removeValue(key: string) {
      logMessage('settings_adapter remove', key)
    },
  },
  time_scale: undefined,
  debug: isDebugEnabled,
  auto_save_delay: 1,
}
