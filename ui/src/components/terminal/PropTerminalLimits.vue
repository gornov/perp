<template>
  <div class="text-12-regular">
    <div class="text-12-semibold mb-2">Loss Limits</div>

    <div class="mb-2 flex items-center gap-3">
      <SvgIcon :size="20" class="text-accent-red" name="ui/chart-decrease" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex justify-between">
          <div class="text-main-secondary">Max Loss:</div>
          <div>
            <UiNum prefix="$">2000</UiNum>
            /
            <UiNum nozeroes prefix="$">{{ userStore.maxLoss }}</UiNum>
          </div>
        </div>
        <SimpleProgressBar :progress="0.3" class="!h-1" color="var(--color-accent-red)" />
      </div>
    </div>

    <div class="mb-2 flex items-center gap-3">
      <SvgIcon :size="20" class="text-accent-red" name="ui/chart-decrease" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex justify-between">
          <div class="text-main-secondary">Daily Loss Limit:</div>
          <div>
            <UiNum prefix="$">1020</UiNum>
            /
            <UiNum nozeroes prefix="$">{{ userStore.maxDayLoss }}</UiNum>
          </div>
        </div>
        <SimpleProgressBar :progress="0.3" class="!h-1" color="var(--color-accent-red)" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import SimpleProgressBar from '@/components/ui/SimpleProgressBar.vue'
import UiNum from '@/components/ui/UiNum.vue'
import useUserStore from '@/stores/user.ts'

const userStore = useUserStore()
</script>
