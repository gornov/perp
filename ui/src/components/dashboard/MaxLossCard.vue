<template>
  <div class="card2">
    <div class="text-20-semibold mb-4">Max Loss</div>
    <div class="mb-4 flex items-center gap-3">
      <SvgIcon :size="32" class="text-accent-red" name="ui/chart-decrease" />
      <div class="flex-1">
        <div class="mb-2 flex items-center justify-between gap-1">
          <div class="flex items-center gap-1">
            <div class="text-16-semibold">$2,000.00</div>
            <div class="text-14-regular text-main-secondary">(20%)</div>
          </div>
          <UiNum class="text-14-regular" nozeroes prefix="$">{{ userStore.maxLoss }}</UiNum>
        </div>
        <SimpleProgressBar :progress="0.2" color="var(--color-accent-red)" />
      </div>
    </div>
    <ul class="pairs-list">
      <li>
        <span>Starting balance</span>
        <span>$100,000</span>
      </li>
      <li>
        <span>Loss threshold</span>
        <span>$90,000.00</span>
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
