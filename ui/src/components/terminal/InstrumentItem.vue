<template>
  <button
    :class="{ 'bg-main-strong-bg rounded-[10px]': active }"
    class="text-12-semibold flex items-center gap-1 p-2"
  >
    <AssetIcon :name="instrument.baseCurrency" :size="16" />
    {{ instrument.baseCurrency }}
    <div
      :class="(instrument.profitDayPercent || 0) < 0 ? 'text-accent-red' : 'text-accent-green'"
      class="flex items-center"
    >
      <SvgIcon
        :name="(instrument.profitDayPercent || 0) < 0 ? 'ui/arrow-down-1' : 'ui/arrow-up-1'"
        :size="16"
      />
      {{ formatNum(instrument.profitDayPercent || 0, 1) }}%
    </div>
  </button>
</template>

<script lang="ts" setup>
import AssetIcon from '@/components/ui/icons/AssetIcon.vue'
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import type Instrument from '@/stores/classes/Instrument.ts'
import formatNum from '@/utils/formatNum'

defineProps<{ instrument: Instrument; active?: boolean }>()
</script>
