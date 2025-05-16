<template>
  <picture
    :style="
      nativeWidth ? `display: inline-block; width: ${minWidth}px; height: ${minHeight}px` : null
    "
  >
    <source
      v-for="(srcset, format) in srcsets"
      :key="format"
      :srcset="srcset"
      :type="`image/${format}`"
    />
    <img :alt="props.alt" :src="props.imgData.img.src" class="min-w-full" />
  </picture>
</template>

<script lang="ts" setup>
/**
 * Usage:
 * import like from '@/assets/img-src/like.png?w=24&as=picture' // as=picture must be last option
 *
 * <UiPicture :img-data="like" alt="Like" />
 */
import { reduce } from 'lodash-es'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    imgData: {
      sources: Record<string, string>
      img: {
        src: string
        w: number
        h: number
      }
    }
    alt: string
    nativeWidth?: boolean
  }>(),
  { nativeWidth: true },
)

function replaceWidthToDPR(srcset: string) {
  // "/1.png 200w, /2.png 400w" -> "/1.png, /2.png 2x"
  return srcset
    .split(/\s*,\s*/)
    .map((src, i) => src.split(' ')[0] + (i !== 0 ? ` ${i + 1}x` : ''))
    .join(', ')
}

const srcsets = computed(() =>
  reduce(
    props.imgData.sources,
    (memo, srcset, format) => ({
      ...memo,
      [format]: replaceWidthToDPR(srcset),
    }),
    {},
  ),
)

const minWidth = computed(() => parseInt(Object.values(props.imgData.sources)[0]?.split(' ')[1]))
const minHeight = computed(() => (props.imgData.img.h / props.imgData.img.w) * minWidth.value)
</script>
