import chartCss from '@/assets/style/tv-theme.css?inline'
import getTheme from '@/utils/getTheme.ts'
import type { ChartingLibraryWidgetOptions, WidgetOverrides } from '@vendor/tradingview'
import Color from 'color'

const overrides: Partial<WidgetOverrides> = {
  'mainSeriesProperties.areaStyle.color1': Color(getTheme('color-main-thirdly')).toString(),
  'mainSeriesProperties.areaStyle.color2': '#151719',
  'mainSeriesProperties.areaStyle.linecolor': Color(getTheme('color-main-white')).toString(),
  'mainSeriesProperties.areaStyle.linewidth': 1,
  'mainSeriesProperties.areaStyle.transparency': 40,
  'mainSeriesProperties.barStyle.barColorsOnPrevClose': false,
  'mainSeriesProperties.barStyle.downColor': Color(getTheme('color-accent-red')).toString(),
  'mainSeriesProperties.barStyle.upColor': Color(getTheme('color-accent-green')).toString(),
  'mainSeriesProperties.baselineStyle.baselineColor': Color(
    getTheme('color-main-thirdly'),
  ).toString(),
  'mainSeriesProperties.baselineStyle.bottomFillColor1': Color(getTheme('color-accent-red'))
    .alpha(0.05)
    .toString(),
  'mainSeriesProperties.baselineStyle.bottomFillColor2': Color(getTheme('color-accent-red'))
    .alpha(0.28)
    .toString(),
  'mainSeriesProperties.baselineStyle.bottomLineColor': Color(
    getTheme('color-accent-red'),
  ).toString(),
  'mainSeriesProperties.baselineStyle.bottomLineWidth': 1,
  'mainSeriesProperties.baselineStyle.topFillColor1': Color(getTheme('color-accent-green'))
    .alpha(0.28)
    .toString(),
  'mainSeriesProperties.baselineStyle.topFillColor2': Color(getTheme('color-accent-green'))
    .alpha(0.05)
    .toString(),
  'mainSeriesProperties.baselineStyle.topLineColor': Color(
    getTheme('color-accent-green'),
  ).toString(),
  'mainSeriesProperties.baselineStyle.topLineWidth': 1,
  'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
  'mainSeriesProperties.candleStyle.borderDownColor': Color(
    getTheme('color-accent-red'),
  ).toString(),
  'mainSeriesProperties.candleStyle.borderUpColor': Color(
    getTheme('color-accent-green'),
  ).toString(),
  'mainSeriesProperties.candleStyle.downColor': Color(getTheme('color-accent-red')).toString(),
  'mainSeriesProperties.candleStyle.upColor': Color(getTheme('color-accent-green')).toString(),
  'mainSeriesProperties.haStyle.barColorsOnPrevClose': false,
  'mainSeriesProperties.haStyle.borderColor': Color(getTheme('color-accent-green')).toString(),
  'mainSeriesProperties.haStyle.borderDownColor': Color(getTheme('color-accent-red')).toString(),
  'mainSeriesProperties.haStyle.borderUpColor': Color(getTheme('color-accent-green')).toString(),
  'mainSeriesProperties.haStyle.downColor': Color(getTheme('color-accent-red')).toString(),
  'mainSeriesProperties.haStyle.upColor': Color(getTheme('color-accent-green')).toString(),
  'mainSeriesProperties.haStyle.wickColor': Color(getTheme('color-main-thirdly')).toString(),
  'mainSeriesProperties.hollowCandleStyle.borderColor': Color(
    getTheme('color-accent-green'),
  ).toString(),
  'mainSeriesProperties.hollowCandleStyle.borderDownColor': Color(
    getTheme('color-accent-red'),
  ).toString(),
  'mainSeriesProperties.hollowCandleStyle.borderUpColor': Color(
    getTheme('color-accent-green'),
  ).toString(),
  'mainSeriesProperties.hollowCandleStyle.downColor': Color(
    getTheme('color-accent-red'),
  ).toString(),
  'mainSeriesProperties.hollowCandleStyle.upColor': Color(
    getTheme('color-accent-green'),
  ).toString(),
  'mainSeriesProperties.hollowCandleStyle.wickColor': Color(
    getTheme('color-main-thirdly'),
  ).toString(),
  'mainSeriesProperties.lineStyle.color': Color(getTheme('color-main-white')).toString(),
  'mainSeriesProperties.lineStyle.linewidth': 1,
  'mainSeriesProperties.priceLineColor': Color(getTheme('color-main-strong-bg')).toString(),
  'paneProperties.background': '#151719',
  'paneProperties.backgroundType': 'solid',
  'paneProperties.horzGridProperties.color': Color(getTheme('color-main-white'))
    .alpha(0.05)
    .toString(),
  'paneProperties.horzGridProperties.style': 2,
  'paneProperties.vertGridProperties.color': Color(getTheme('color-main-white'))
    .alpha(0.05)
    .toString(),
  'paneProperties.vertGridProperties.style': 2,
  'scalesProperties.fontSize': 10,
  'scalesProperties.lineColor': 'rgba(0, 0, 0, 0)',
  'scalesProperties.showBidAskLabels': true,
  'scalesProperties.textColor': Color(getTheme('color-main-secondary')).toString(),
  'symbolWatermarkProperties.color': 'rgba(0, 0, 0, 0)',
}

const chartCssUrl = URL.createObjectURL(new Blob([chartCss], { type: 'text/css' }))

export const styles: Partial<ChartingLibraryWidgetOptions> = {
  custom_css_url: chartCssUrl,
  custom_font_family: '"Wix Madefor Text", sans-serif',
  theme: 'Dark',
  overrides,
}
