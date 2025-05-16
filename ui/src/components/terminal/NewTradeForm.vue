<template>
  <div class="card pt-0">
    <TabsComponent v-model="direction" class="mb-3 w-full">
      <TabItem class="flex-1" tab-key="long">Long</TabItem>
      <TabItem class="flex-1" tab-key="short">Short</TabItem>
    </TabsComponent>

    <div
      class="bg-main-strong-bg text-12-regular mb-3 flex justify-between rounded-[10px] px-3 py-2"
    >
      Market:
      <UiNum :precision="instrument.pricePrecision" prefix="$"
        >{{ direction === 'long' ? instrument.ask : instrument.bid }}
      </UiNum>
    </div>

    <label class="border-main-thirdly mb-4 flex gap-2 rounded-xl border px-3 py-2.5">
      <VueAutonumeric
        ref="inputRef"
        v-model.number="volume"
        :options="{
          caretPositionOnFocus: 'end',
          decimalPlaces: 2,
          allowDecimalPadding: true,
          emptyInputBehavior: 'min',
          minimumValue: '0',
          maximumValue: '9999999999',
          onInvalidPaste: 'ignore',
          outputFormat: 'number',
          selectOnFocus: true,
          showWarnings: false,
        }"
        class="text-14-regular w-full"
        @keydown.enter.prevent=""
      />
    </label>
    <UiButton
      :class="direction === 'long' ? 'bg-accent-green' : 'bg-accent-red'"
      :loading="loading"
      class="text-main-black-bg w-full"
      @click="createTrade"
    >
      {{ direction === 'long' ? 'Long / Buy' : 'Short / Sell' }}
    </UiButton>
  </div>
</template>

<script lang="ts" setup>
import tradesApi from '@/api/tradesApi.ts'
import TabItem from '@/components/ui/tabs/TabItem.vue'
import TabsComponent from '@/components/ui/tabs/TabsComponent.vue'
import UiButton from '@/components/ui/UiButton.vue'
import UiNum from '@/components/ui/UiNum.vue'
import VueAutonumeric from '@/components/VueAutonumeric.vue'
import type Instrument from '@/stores/classes/Instrument.ts'
import { ref } from 'vue'

const props = defineProps<{ instrument: Instrument }>()

const direction = ref<'long' | 'short'>('long')
const volume = ref(10)
const loading = ref(false)

function createTrade() {
  loading.value = true
  try {
    tradesApi.create(
      props.instrument.symbol,
      volume.value,
      10,
      direction.value === 'long' ? 'buy' : 'sell',
    )
  } finally {
    loading.value = false
  }
}
</script>
