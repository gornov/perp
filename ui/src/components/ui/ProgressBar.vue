<template>
  <div ref="root">
    <div ref="trackRef" class="-my-4 py-4" tabindex="0">
      <div
        class="bg-main-modal-bg stripes pointer-events-none relative mb-2 flex h-4 items-center justify-between rounded-full px-2.5 py-[5px]"
      >
        <template v-for="(mark, i) in marks" :key="i">
          <div v-if="i !== 0" :style="`flex: ${mark.position - marks[i - 1].position}`" />
          <div class="flex w-0 justify-center">
            <div class="bg-accent-blue h-2 w-2 flex-shrink-0 rounded-full" />
          </div>
        </template>
        <div
          :style="`clip-path: inset(0 calc(${100 - prettyProgress * 100}%) 0% 0 round 99px);` /* clipped and colorized copy of parent */"
          class="bg-accent-blue absolute left-0 flex h-full w-full items-center justify-between rounded-full px-2.5"
        >
          <template v-for="(v, i) in marks" :key="i">
            <div v-if="i !== 0" :style="`flex: ${v.position - marks[i - 1].position}`" />
            <div class="flex w-0 justify-center">
              <div class="bg-main-white h-2 w-2 flex-shrink-0 rounded-full" />
            </div>
          </template>
        </div>
        <div v-if="showTooltip" class="prize-tooltip prize-tooltip--bottom">
          <div v-for="(line, i) in tooltipLines" :key="i">{{ line }}</div>
        </div>
      </div>
    </div>
    <div class="pointer-events-none flex items-center justify-between px-2.5">
      <template v-for="(mark, i) in marks" :key="i">
        <div v-if="i !== 0" :style="`flex: ${mark.position - marks[i - 1].position}`" />
        <div
          class="text-16-semibold pointer-events-auto flex w-0 flex-col items-center whitespace-nowrap"
          @click="$emit('clickMark', i)"
        >
          <div v-for="(line, i) in mark.labels" v-show="mark" :key="i">{{ line }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useElementBounding, usePointerSwipe } from '@vueuse/core'
import { clamp } from 'lodash-es'
import { computed, ref, watch, watchEffect } from 'vue'

const props = defineProps<{
  progress: number // 0-1
  marks: { position: number; labels: string[] | number[] | null }[]
  tooltipLines: (string | number)[]
  showTooltip: boolean
}>()

const emit = defineEmits<{ clickMark: [number]; swipe: [number] }>()

const root = ref<HTMLDivElement | null>(null)
const trackRef = ref<HTMLDivElement | null>(null)
const { width } = useElementBounding(root)

const prettyProgress = computed(() => props.progress + ((1 - props.progress) * 20) / width.value)

function positioningTooltip() {
  if (props.showTooltip) {
    root.value?.querySelectorAll('.prize-tooltip').forEach((el) => {
      if (el instanceof HTMLElement && root.value) {
        const centerX = root.value.offsetWidth * prettyProgress.value - 10
        const clampedCenterX = clamp(
          centerX,
          el.offsetWidth / 2,
          root.value.offsetWidth - el.offsetWidth / 2,
        )
        el.style.left = clampedCenterX + 'px'
        const arrowOffset = clamp(
          centerX - clampedCenterX,
          -el.offsetWidth / 2 + 10,
          el.offsetWidth / 2 - 10,
        )
        el.style.setProperty('--arrow-offset', arrowOffset + 'px')
      }
    })
  }
}

watchEffect(positioningTooltip, { flush: 'post' })
watch(width, positioningTooltip)

const emitSwipe = (x: number) => emit('swipe', clamp(x / width.value, 0, 1))
usePointerSwipe(trackRef, {
  threshold: 0,
  disableTextSelect: true,
  onSwipe: (e) => emitSwipe(e.offsetX),
  onSwipeStart: (e) => emitSwipe(e.offsetX),
})
</script>

<style scoped>
@reference '@/assets/style/style.css'

.flex {
  display: flex;
}

.prize-tooltip {
  @apply bg-main-black-bg text-main-white border-main-modal-bg text-16-semibold absolute flex min-w-10 -translate-x-1/2 flex-col items-center rounded-md border p-2 whitespace-nowrap;

  background-image: radial-gradient(
    100% 100% at 50% 125%,
    rgb(81 141 249 / 20%) 0%,
    rgb(81 141 249 / 0%) 100%
  );

  &::after {
    content: '';
    position: absolute;
    left: calc(50% + var(--arrow-offset, 0px));
    z-index: -1;
    margin-left: -3px;
    width: 6px;
    height: 6px;
    transform: rotate(45deg);
    background: var(--color-main-black-bg);
    border-width: 1px 0 0 1px;
    border-style: solid;
    border-color: var(--color-main-modal-bg);
  }

  &.prize-tooltip--top {
    bottom: 21px;

    &::after {
      bottom: -3px;
      transform: rotate(-135deg);
    }
  }

  &.prize-tooltip--bottom {
    top: 21px;

    &::after {
      top: -3.5px;
    }
  }
}

.stripes {
  background: repeating-linear-gradient(
    -80deg,
    var(--color-main-modal-bg),
    var(--color-main-modal-bg) 2px,
    transparent 2px,
    transparent 4px
  );
}
</style>
