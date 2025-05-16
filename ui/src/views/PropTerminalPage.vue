<template>
  <div v-if="instrument">
    <PropTerminalHeader class="mb-3" />
    <InstrumentsLine v-model="activeSymbol" class="hide-scrollbar mb-3 overflow-auto" />
    <div class="flex w-full gap-3">
      <div class="flex flex-1 flex-col gap-3">
        <div class="card p-3">
          <InstrumentInfo :instrument="instrument" />
          <TVChart
            :lines="[
              { name: 'ask', price: instrument.ask, color: getTheme('color-accent-red') },
              { name: 'bid', price: instrument.bid, color: getTheme('color-accent-green') },
            ]"
            :symbol="activeSymbol"
            chart-type="instrument"
            class="h-[415px]"
          />
        </div>
        <div class="card pt-0">
          <TabsComponent class="mb-3" model-value="positions">
            <TabItem tab-key="positions">Positions</TabItem>
            <TabItem tab-key="orders">Orders</TabItem>
            <TabItem tab-key="history">History</TabItem>
            <TabItem tab-key="balances">Balances</TabItem>
          </TabsComponent>

          <ActiveTrades :instrument="instrument" />
        </div>
      </div>
      <div class="flex w-[323px] shrink-0 flex-col gap-3">
        <div class="card flex flex-col gap-3">
          <PropTerminalGoals />
          <PropTerminalLimits />
          <UiButton
            class="w-full"
            end-icon="ui/arrow-right-02"
            theme="secondary"
            @click="$router.push({ name: 'dashboard' })"
          >
            Go to dashboard
          </UiButton>
        </div>
        <NewTradeForm :instrument="instrument" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import catchApiError from '@/api/catchApiError.ts'
import instrumentsApi from '@/api/instrumentsApi.ts'
import ActiveTrades from '@/components/terminal/ActiveTrades.vue'
import InstrumentInfo from '@/components/terminal/InstrumentInfo.vue'
import InstrumentsLine from '@/components/terminal/InstrumentsLine.vue'
import NewTradeForm from '@/components/terminal/NewTradeForm.vue'
import PropTerminalGoals from '@/components/terminal/PropTerminalGoals.vue'
import PropTerminalHeader from '@/components/terminal/PropTerminalHeader.vue'
import PropTerminalLimits from '@/components/terminal/PropTerminalLimits.vue'
import TVChart from '@/components/TVChart.vue'
import TabItem from '@/components/ui/tabs/TabItem.vue'
import TabsComponent from '@/components/ui/tabs/TabsComponent.vue'
import UiButton from '@/components/ui/UiButton.vue'
import useRouteTab from '@/composables/useRouteTab.ts'
import useInstrumentsStore from '@/stores/instruments.ts'
import getTheme from '@/utils/getTheme.ts'
import { useTimeoutPoll } from '@vueuse/core'
import { computed } from 'vue'

const instrumentStore = useInstrumentsStore()
const defaultSymbol = computed(() => instrumentStore.instruments[0]?.symbol)
const activeSymbol = useRouteTab<string>(defaultSymbol, 'symbol')
const instrument = computed(() => instrumentStore.instrumentsMap[activeSymbol.value])

useTimeoutPoll(async () => {
  if (instrument.value) {
    const { price, symbol } = await catchApiError(() => instrumentsApi.getPrice(activeSymbol.value))
    if (symbol === activeSymbol.value) {
      instrumentStore.instrumentsMap[activeSymbol.value].rate = price
      instrumentStore.instrumentsMap[activeSymbol.value].bid = price * 1.001
      instrumentStore.instrumentsMap[activeSymbol.value].ask = price * 0.999
    }
  }
}, 1000)
</script>
