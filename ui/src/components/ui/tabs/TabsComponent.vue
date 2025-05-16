<template>
  <div ref="tabs" :class="`tabs--theme_${theme}`" class="tabs">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { onBeforeUpdate, provide, ref } from 'vue'

const key = defineModel<unknown>({ required: true })
withDefaults(defineProps<{ theme?: 'upperline1' | 'upperline2' | 'ghost' }>(), {
  theme: 'upperline2',
})
const bgRect = ref<DOMRect | undefined>(undefined)
const tabs = ref<HTMLElement | null>(null)
provide('tabKey', key)
provide('onTabClick', (k: string | number) => (key.value = k))
provide('bgRect', bgRect)

// remember bg position to correct render in new tab
onBeforeUpdate(() => (bgRect.value = tabs.value?.querySelector('.js-bg')?.getBoundingClientRect()))
</script>
