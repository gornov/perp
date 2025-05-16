<template>
  <component :is="tag" v-if="!inplace" :style="style" class="svg-icon">
    <svg>
      <use :href="`#${domId}`" />
    </svg>
  </component>
  <component :is="tag" v-else :style="style" class="svg-icon" v-html="content"></component>
</template>

<script lang="ts" setup>
import iconLoaders from '@/components/ui/icons/iconLoaders'
import { computed, ref, watchEffect } from 'vue'

const props = withDefaults(
  defineProps<{
    name: string
    fallback?: string
    color?: 'native' | 'current'
    baseline?: boolean | number // pad icon to align to text, e.g. (line-height in em) - 1 or false to disable. Default: false
    size?: number // px size. Default: current font size
    tag?: string
    inplace?: boolean // paste content instead of link, useful for restarting animation
  }>(),
  { fallback: '', color: 'current', baseline: false, tag: 'span' },
)

const localName = computed(() => {
  const name = props.name.toLowerCase()
  return iconLoaders[name] ? name : props.fallback
})

const id = computed(() => `icons/${localName.value}`)
const domId = computed(() => id.value + (props.color === 'current' ? '--mono' : ''))
const content = ref<string>('')

const style = computed(
  () =>
    (props.size ? `font-size: ${props.size}px;` : '') +
    (props.baseline ? `margin-bottom: ${props.baseline}em; vertical-align: middle;` : ''),
)

watchEffect(() => {
  const idValue = id.value
  const path = localName.value
  if (iconLoaders[path]) {
    let svgHolder = document.getElementById('svg-holder')
    if (!svgHolder) {
      svgHolder = document.createElement('div')
      svgHolder.id = 'svg-holder'
      svgHolder.style.position = 'absolute'
      svgHolder.style.width = '0'
      svgHolder.style.height = '0'
      svgHolder.style.overflow = 'hidden'
      document.body.appendChild(svgHolder)
    }

    const svgInHolder = document.getElementById(idValue)
    if (!svgInHolder) {
      // hold id while loading
      const dummySvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      dummySvg.id = idValue
      svgHolder.appendChild(dummySvg)
      iconLoaders[path]()
        .then((svg: string) => {
          svg =
            svg.replace('<svg ', `<svg id="${idValue}" `) +
            svg
              .replace('<svg ', `<svg id="${idValue}--mono" `)
              .replace(/(fill|stroke)="(?!none"|transparent")([^"]+")/g, '$1="currentColor"')
          dummySvg.outerHTML = svg
          if (props.inplace) content.value = document.getElementById(domId.value)!.outerHTML
        })
        .catch(() => dummySvg.remove())
    } else if (props.inplace) {
      content.value = document.getElementById(domId.value)!.outerHTML
    }
  }
})
</script>
