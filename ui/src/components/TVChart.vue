<template>
  <div v-once ref="containerRef" class="relative" />
</template>

<script lang="ts" setup>
import { type IOrderLineAdapter, widget as Widget } from '@vendor/tradingview'
import { find, keys } from 'lodash-es'
import { onMounted, ref, watch } from 'vue'

type ChartLine = { name: string; price: number; color: string }

const props = defineProps<{
  lines: ChartLine[]
  symbol: string
  chartType: ChartType
}>()

const containerRef = ref<HTMLElement | null>(null)
const cleanupCallbacks: (() => void)[] = []

function cleanup() {
  cleanupCallbacks.forEach((cb) => cb())
  cleanupCallbacks.length = 0
}

async function attachWidget() {
  if (!containerRef.value) return

  const addedLines: Record<string, IOrderLineAdapter> = {}
  cleanup()
  containerRef.value.innerHTML = ''

  const { createWidgetOptions } = await import('@/utils/trading-view-chart/createWidgetOptions')
  const options = createWidgetOptions(containerRef.value, props.symbol, props.chartType, 'en')

  const widget = new Widget(options)
  cleanupCallbacks.push(() => widget.remove())

  await new Promise((resolve) => widget.onChartReady(() => resolve(null)))

  if (!containerRef.value) return // again after await

  widget.subscribe('study', () => widget.closePopupsAndDialogs())
  widget.activeChart().executeActionById('chartReset')

  cleanupCallbacks.push(
    watch(
      () => props.lines,
      (curr) => {
        for (const line of curr) {
          try {
            if (addedLines[line.name]) {
              addedLines[line.name].setPrice(line.price)
            } else {
              addedLines[line.name] = widget
                .activeChart()
                .createOrderLine()
                .setPrice(line.price)
                .setText('')
                .setQuantity('')
                .setLineWidth(0.5)
                .setLineColor(line.color)
                .setLineStyle(2) // dashed
            }
          } catch (e) {
            console.warn(e)
          }
        }
        for (const name of keys(addedLines)) {
          if (!find(curr, { name })) {
            if (addedLines[name]) {
              addedLines[name].remove()
              delete addedLines[name]
            }
          }
        }
      },
      { immediate: true },
    ),
  )

  cleanupCallbacks.push(
    watch(
      () => props.symbol,
      async () => {
        if (props.symbol && widget.activeChart().symbol() !== props.symbol) {
          widget.activeChart().setSymbol(props.symbol)
        }
      },
    ),
  )
}

onMounted(attachWidget)
</script>
