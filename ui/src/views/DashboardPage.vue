<template>
  <div>
    <div class="mb-3 flex gap-3">
      <ProfitTargetCard class="flex-1" />
      <MaxLossCard class="flex-1" />
      <DailyLossLimit class="flex-1" />
    </div>
    <StatisticsCard class="mb-3" />
    <div class="flex gap-3">
      <ChallengeProgressCard class="flex-3" />
      <div class="flex-2">
        <AccountDetailsCard class="mb-3" />
        <DailySummaryCard />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import AccountDetailsCard from '@/components/dashboard/AccountDetailsCard.vue'
import ChallengeProgressCard from '@/components/dashboard/ChallengeProgressCard.vue'
import DailyLossLimit from '@/components/dashboard/DailyLossLimit.vue'
import DailySummaryCard from '@/components/dashboard/DailySummaryCard.vue'
import MaxLossCard from '@/components/dashboard/MaxLossCard.vue'
import ProfitTargetCard from '@/components/dashboard/ProfitTargetCard.vue'
import StatisticsCard from '@/components/dashboard/StatisticsCard.vue'
</script>
