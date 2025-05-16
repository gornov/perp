<template>
  <button
    ref="btn"
    :class="{ 'tabs__item--active': active, 'opacity-30': disabled }"
    :disabled="disabled"
    class="tabs__item"
    @click="onTabClick?.(props.tabKey)"
  >
    <span v-if="active" :style="bgStyle" class="tabs__pointer js-bg"></span>
    <slot />
  </button>
</template>

<script lang="ts" setup>
import { computed, inject, ref, type Ref, watch, watchEffect } from 'vue'

const props = defineProps<{ tabKey: unknown; disabled?: boolean }>()
const currentTabKey = inject<Ref<unknown>>('tabKey')
const onTabClick = inject<(a: unknown) => void>('onTabClick')
const bgRect = inject<Ref<DOMRect | undefined>>('bgRect')
const bgStyle = ref<string>('')
const active = computed(
  () => currentTabKey?.value !== undefined && currentTabKey.value === props.tabKey,
)
const btn = ref<HTMLElement | null>(null)

watch(
  active,
  () => {
    if (active.value && btn.value && bgRect?.value) {
      const { x, y } = btn.value.getBoundingClientRect()
      // restore bg position relative current tab considering previous position
      bgStyle.value = `left: ${bgRect?.value?.x - x}px; top: ${bgRect?.value?.y - y}px; width: ${bgRect.value?.width}px; height: ${bgRect.value?.height}px`
      // run animation
      requestAnimationFrame(() => (bgStyle.value = ''))
    }
  },
  { flush: 'pre' },
)

watchEffect(
  () => {
    if (active.value) {
      const parent = btn.value?.parentElement
      if (parent && btn.value)
        // don't use scrollIntoView - it scrolls even containing iframe and interferes outer with scrollTo
        parent.scrollTo({
          behavior: 'smooth',
          left: btn.value.offsetLeft - parent.offsetWidth / 2 + btn.value.offsetWidth / 2,
          top: btn.value.offsetTop - parent.offsetHeight / 2 + btn.value.offsetHeight / 2,
        })
    }
  },
  { flush: 'post' },
)
</script>
