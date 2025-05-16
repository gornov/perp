<template>
  <div class="card2">
    <div class="text-20-semibold mb-4">Statistics</div>
    <div class="grid grid-cols-5 gap-3">
      <StatisticsItem v-for="(v, k) in statistics" :key="k" class="card p-4" v-bind="v" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import StatisticsItem from '@/components/dashboard/StatisticsItem.vue'
import useStatistics from '@/composables/useStatistics.ts'

const { statistics } = useStatistics()
</script>
