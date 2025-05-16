<template>
  <div class="flex items-center gap-3">
    <slot name="icon" />
    <div :style="iconStyle" class="rounded-lg border p-2.5">
      <SvgIcon :name="icon" :size="20" class="flex" />
    </div>
    <div class="flex-1">
      <div class="text-main-secondary text-14-regular">
        {{ label }}
      </div>
      <div class="text-16-semibold">
        {{ value }}
      </div>
      <SimpleProgressBar
        v-if="progress !== undefined"
        :color="progressColor"
        :progress="progress"
        class="mt-2"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import SimpleProgressBar from '@/components/ui/SimpleProgressBar.vue'
import { computed } from 'vue'

const props = defineProps<{
  icon: string
  color: 'green' | 'red' | 'blue'
  label: string
  value: string
  progress?: number
}>()

const iconStyle = computed(() => {
  switch (props.color) {
    case 'green':
      return {
        background: 'var(--color-dark-green)',
        borderColor: 'var(--color-stroke-green)',
      }
    case 'red':
      return {
        background: 'var(--color-dark-red)',
        borderColor: 'var(--color-stroke-red)',
      }
    default:
      return {
        background: 'var(--color-dark-blue)',
        borderColor: 'var(--color-stroke-blue)',
      }
  }
})

const progressColor = computed(() => {
  switch (props.color) {
    case 'green':
      return 'var(--color-accent-green)'
    case 'red':
      return 'var(--color-accent-red)'
    default:
      return 'var(--color-accent-blue)'
  }
})
</script>
