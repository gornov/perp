<template>
  <ProgressBar
    :marks="markLabels"
    :progress="steppedProgress"
    :show-tooltip="true"
    :tooltip-lines="[`$${balance}k`]"
    @swipe="(v) => (steppedProgress = v)"
  />
</template>

<script lang="ts" setup>
import ProgressBar from '@/components/ui/ProgressBar.vue'
import { computed, ref, watch } from 'vue'

const emit = defineEmits<{ change: [number] }>()

const marks = Array(8)
  .fill(null)
  .map((_, i) => (i + 1) * 25)

const markLabels = marks.map((v, _, arr) => ({
  position: (v - arr[0]) / (arr[arr.length - 1] - arr[0]),
  labels: [`$${v}k`],
}))

const progress = ref(1)
const steppedProgress = computed({
  get: () => progress.value,
  set: (v) => (progress.value = Math.floor(v * 7) / 7),
})
const balance = computed(() =>
  Math.floor(progress.value * (marks[marks.length - 1] - marks[0]) + marks[0]),
)

watch(balance, () => emit('change', balance.value), { immediate: true })
</script>
