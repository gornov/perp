<template>
  <div>
    <table class="text-12-regular table w-full">
      <thead>
        <tr>
          <th>Market</th>
          <th>Side</th>
          <th>Size</th>
          <th>PnL</th>
          <th>Entry Price</th>
          <th>Mark Price</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="trade in trades" :key="trade.id">
          <td class="flex items-center gap-2">
            <AssetIcon :name="trade.symbol.replace(/USDT?$/, '')" :size="16" />
            <div>
              <div class="font-semibold">{{ trade.symbol }}</div>
<!--              <div class="text-main-secondary">{{ trade.alias }}</div>-->
            </div>
          </td>
          <td>{{ trade.side }}</td>
          <td>
            <UiNum prefix="$">{{ trade.amount * trade.mult }}</UiNum>
          </td>
          <td>
            <UiNum colorize plus prefix="$">{{ trade.profit }}</UiNum>
          </td>
          <td>
            <UiNum prefix="$">{{ trade.openRate }}</UiNum>
          </td>
          <td>
            <UiNum prefix="$">0.01</UiNum>
          </td>
          <td class="flex justify-between">
            <SvgIcon :size="16" class="text-accent-blue" name="ui/setting-2" tag="button" />
            <SvgIcon
              :size="16"
              class="text-accent-red"
              name="ui/close-circle"
              tag="button"
              @click="close(trade.id)"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <div v-if="!tradesStore.trades.length" class="flex h-20 items-center justify-center">
      <div class="flex items-center gap-2">
        <SvgIcon :size="20" color="native" name="ui/wallet-remove" />
        No transactions yet
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import catchApiError from '@/api/catchApiError.ts'
import tradesApi from '@/api/tradesApi.ts'
import AssetIcon from '@/components/ui/icons/AssetIcon.vue'
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import UiNum from '@/components/ui/UiNum.vue'
import useActiveTradesStore from '@/stores/activeTrades.ts'
import type Instrument from '@/stores/classes/Instrument.ts'
import { computed } from 'vue'

const props = defineProps<{ instrument: Instrument }>()

const tradesStore = useActiveTradesStore()
const trades = computed(() =>
  tradesStore.trades.filter(
    (trade) => trade.state === 'open' && trade.instrument.symbol === props.instrument.symbol,
  ),
)

function close(id: number) {
  catchApiError(() => tradesApi.close(id))
}
</script>
