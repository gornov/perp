<template>
  <div class="bg-main-bg border-stroke flex items-center gap-1 rounded-4xl border px-2">
    <SvgIcon :size="20" class="text-main-thirdly me-1" name="ui/star" />
    <InstrumentItem
      v-for="instrument in instruments"
      :key="instrument.symbol"
      :active="activeSymbol === instrument.symbol"
      :instrument="instrument"
      @click="activeSymbol = instrument.symbol"
    />
  </div>
</template>

<script lang="ts" setup>
import InstrumentItem from '@/components/terminal/InstrumentItem.vue'
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import useInstrumentsStore from '@/stores/instruments.ts'

const { instruments } = useInstrumentsStore()
const activeSymbol = defineModel<string>({ required: true })
</script>
