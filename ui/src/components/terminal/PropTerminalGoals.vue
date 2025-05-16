<template>
  <div class="text-12-regular">
    <div class="text-12-semibold mb-2">Goal</div>
    <div class="flex gap-3 items-center">
      <SvgIcon :size="20" class="text-accent-green" name="ui/target-dollar" />
      <div class="flex flex-1 flex-col gap-2">
        <div class="flex justify-between">
          <div class="text-main-secondary">Profit Target:</div>
          <div>
            <UiNum prefix="$">{{ userStore.totalPl }}</UiNum>
            /
            <UiNum nozeroes prefix="$">{{ userStore.profitGoal }}</UiNum>
          </div>
        </div>
        <SimpleProgressBar :progress="0.3" class="!h-1" color="var(--color-accent-green)" />
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
