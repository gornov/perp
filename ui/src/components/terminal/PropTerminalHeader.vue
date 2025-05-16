<template>
  <div class="flex gap-3">
    <div class="card">
      <div class="text-16-semibold">Mifunder Evaluation</div>
      <div class="text-14-semibold text-main-secondary">Phase 1</div>
    </div>
    <div class="card flex-1">
      <div class="flex justify-between gap-1">
        <StatisticsItem
          v-for="(v, k) in statistics"
          :key="k"
          :color="v.color"
          :icon="v.icon"
          :label="v.label"
          :value="v.value"
          class="flex-1"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import StatisticsItem from '@/components/dashboard/StatisticsItem.vue'
import useStatistics from '@/composables/useStatistics.ts'

const { getItems } = useStatistics()
const statistics = getItems(['BALANCE', 'EQUITY', 'FREE_FUNDS', 'MARGIN', 'MARGIN_LEVEL', 'PNL'])
</script>
