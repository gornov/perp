<template>
  <div class="bg-main-strong-bg relative h-2 overflow-hidden rounded-full">
    <div
      :style="{ width: `${progress * 100}%`, background: color }"
      class="absolute top-0 left-0 h-full rounded-full"
    ></div>
  </div>
</template>

<script lang="ts" setup>
withDefaults(defineProps<{ progress: number; color?: string }>(), {
  color: 'var(--color-accent-blue)',
})
</script>
