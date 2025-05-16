<template>
  <div
    class="divide-main-strong-bg border-main-strong-bg flex items-center gap-3 divide-x-1 border-b pb-3 [&>*]:pe-3"
  >
    <div class="flex items-center gap-1">
      <AssetIcon :name="instrument.baseCurrency" />
      <div class="text-14-semibold flex gap-0.5">
        {{ instrument.baseCurrency }}
        <span class="text-main-secondary">/</span>
        {{ instrument.quoteCurrency }}
      </div>
      <div
        class="text-12-regular text-accent-green bg-main-strong-bg flex items-center rounded-full px-2"
      >
        100x
      </div>
    </div>
    <UiNum class="text-14-semibold" colorize prefix="$">129.45</UiNum>
    <div class="flex items-center gap-1">
      <span class="text-12-regular text-main-secondary">24h High:</span>
      <UiNum class="text-12-semibold" prefix="$">127.55</UiNum>
    </div>
    <div class="flex items-center gap-1">
      <span class="text-12-regular text-main-secondary">24h Low:</span>
      <UiNum class="text-12-semibold" prefix="$">127.55</UiNum>
    </div>
    <div class="flex items-center gap-1">
      <span class="text-12-regular text-main-secondary">24h Change:</span>
      <UiNum class="text-12-semibold" colorize plus postfix="%">-0.59</UiNum>
    </div>
    <div class="flex items-center gap-1">
      <span class="text-12-regular text-main-secondary">24h Volume:</span>
      <UiNum class="text-12-semibold" postfix="M" prefix="$">5.55</UiNum>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AssetIcon from '@/components/ui/icons/AssetIcon.vue'
import UiNum from '@/components/ui/UiNum.vue'
import Instrument from '@/stores/classes/Instrument.ts'

defineProps<{ instrument: Instrument }>()
</script>
