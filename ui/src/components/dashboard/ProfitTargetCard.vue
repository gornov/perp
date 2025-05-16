<template>
  <div class="card2">
    <div class="text-20-semibold mb-4">Profit Target</div>
    <div class="mb-4 flex items-center gap-3">
      <SvgIcon :size="32" class="text-accent-green" name="ui/target-dollar" />
      <div class="flex-1">
        <div class="mb-2 flex items-center justify-between gap-1">
          <div class="flex items-center gap-1">
            <UiNum class="text-16-semibold" prefix="$">{{ userStore.totalPl }}</UiNum>
            <span class="text-14-regular text-main-secondary">
              (
              <UiNum nozeroes postfix="%">
                {{ (userStore.totalPl * 100) / userStore.profitGoal }}
              </UiNum>
              )
            </span>
          </div>
          <UiNum class="text-14-regular" nozeroes prefix="$">{{ userStore.profitGoal }}</UiNum>
        </div>
        <SimpleProgressBar
          :progress="userStore.totalPl / userStore.profitGoal"
          color="var(--color-accent-green)"
        />
      </div>
    </div>
    <ul class="pairs-list">
      <li>
        <span>Profit remaining</span>
        <UiNum nozeroes prefix="$">{{ userStore.profitGoal - userStore.totalPl }}</UiNum>
      </li>
      <li>
        <span>Target amount</span>
        <UiNum nozeroes prefix="$">{{ userStore.profitGoal + userStore.initBalance }}</UiNum>
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
