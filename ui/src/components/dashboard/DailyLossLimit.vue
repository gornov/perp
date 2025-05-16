<template>
  <div class="card2">
    <div class="text-20-semibold mb-4">Daily Loss Limit</div>
    <div class="mb-4 flex items-center gap-3">
      <SvgIcon :size="32" class="text-accent-red" name="ui/chart-decrease" />
      <div class="flex-1">
        <div class="mb-2 flex items-center justify-between gap-1">
          <div class="flex items-center gap-1">
            <div class="text-16-semibold">$1,020.00</div>
            <div class="text-14-regular text-main-secondary">(20%)</div>
          </div>
          <UiNum class="text-14-regular" nozeroes prefix="$">{{ userStore.maxDayLoss }}</UiNum>
        </div>
        <SimpleProgressBar :progress="0.2" color="var(--color-accent-red)" />
      </div>
    </div>
    <ul class="pairs-list">
      <li>
        <span>Today's starting balance</span>
        <span>$100,083.31</span>
      </li>
      <li>
        <span>Threshold at</span>
        <span>$95,083.31</span>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import SimpleProgressBar from '@/components/ui/SimpleProgressBar.vue'
import UiNum from '@/components/ui/UiNum.vue'
import useUserStore from '@/stores/user.ts'

const userStore = useUserStore()
</script>
