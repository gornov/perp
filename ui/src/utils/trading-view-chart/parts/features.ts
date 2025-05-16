import type { ChartingLibraryFeatureset } from '@vendor/tradingview'

const disabled_features: ChartingLibraryFeatureset[] = [
  'border_around_the_chart',
  'context_menus',
  'cropped_tick_marks',
  'create_volume_indicator_by_default',
  'display_market_status',
  'go_to_date',
  'header_compare',
  // 'header_fullscreen_button',
  'header_screenshot',
  // 'header_settings',
  'header_symbol_search',
  'header_undo_redo',
  'items_favoriting',
  // 'left_toolbar',
  // 'legend_widget',
  'main_series_scale_menu',
  'popup_hints',
  // 'symbol_info',
  'symbol_search_hot_key',
  'timeframes_toolbar',
  'timezone_menu',
]

const enabled_features: ChartingLibraryFeatureset[] = []

export const features = {
  disabled_features,
  enabled_features,
}
