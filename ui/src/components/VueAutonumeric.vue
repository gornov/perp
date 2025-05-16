<template>
  <component
    :is="props.tag"
    ref="autoNumericElement"
    :contenteditable="isInput ? null : true"
    :inputmode="initialOptions?.decimalPlaces ? 'decimal' : 'numeric'"
    :type="isInput ? 'text' : null"
  />
</template>

<script lang="ts" setup>
import { autoNumericDefaults } from '@/utils/autoNumericDefaults'
import { useEventListener } from '@vueuse/core'
import type { Options, PredefinedOptions } from 'autonumeric'
import AutoNumeric from 'autonumeric'
import { clone, extend, isEqual } from 'lodash-es'
import { computed, onMounted, ref, watch } from 'vue'

let autoNumericElement = ref<null | HTMLElement>(null)
defineExpose({ element: autoNumericElement })

let props = withDefaults(
  defineProps<{
    tag?: string
    options?: Partial<PredefinedOptions>
    modelValue: number
    /**
     * If set to `true`, whenever the `options` prop changes, the AutoNumeric settingsApi are first reset to the AutoNumeric defaults options.
     * This is set to `true` by default so that it allows for users to pass predefined option names and be sure that no previous settingsApi would be kept, resulting in an unusual result (ie. when switching from 'integer' to 'euro', the decimalPlaces would still be `0`).
     */
    resetOnOptions?: boolean
    preventFocusedChange?: boolean
  }>(),
  { tag: 'input', resetOnOptions: true },
)

let emits = defineEmits(['update:modelValue'])
let anElement = ref<AutoNumeric | null>(null)
let initialOptions = ref<Options>(extend({}, autoNumericDefaults, props.options)) // Store the options that were first used when initializing the component
let isInput = props.tag.toLowerCase() === 'input'

function clamp(value: number | string) {
  value = +value
  if (anElement.value && !isNaN(value)) {
    // @ts-expect-error ¯\_(ツ)_/¯
    let settings = anElement.value.settings
    if (value < +settings.minimumValue) {
      return +settings.minimumValue
    } else if (value > +settings.maximumValue) {
      return +settings.maximumValue
    }
    return value
  }
  return value
}

/**
 * This computed property is created in order to be able to watch the changes to both `value` and `options` at the same time.
 * This is important since if both are changed at the same time, `options` needs to be updated *before* `value` (the order here is important, and is respected in the `anInfo` watcher).
 *
 * cf. https://github.com/vuejs/vue/issues/7723#issuecomment-369344926
 *
 * @returns {Object}
 */

let anInfo = computed(() => ({
  value: props.modelValue,
  options: props.options,
}))

watch(anInfo, (newValue, oldValue) => {
  if (anElement.value) {
    // 1) First, check if the options have changed, if that's the case, update those first
    // Compare the new and old options, and only update if they are different
    if (oldValue.options && !isEqual(newValue.options, oldValue.options)) {
      if (props.resetOnOptions) {
        // This is needed when using predefined options that do not override previously used options
        anElement.value.options.reset()
      }

      const optionsToUse = { ...autoNumericDefaults, ...newValue.options }

      anElement.value.update(optionsToUse)
    }
    // 2) Then check if the value has changed, if it's defined
    newValue.value = clamp(newValue.value)
    if (
      newValue.value !== undefined &&
      // Make sure this is only called when the value is set by an external script, and not from a user input
      anElement.value.getNumber() !== newValue.value &&
      // Compare the 'newValue' with the current 'oldValue' so we do not `set` it again if it's not needed
      newValue.value !== oldValue.value &&
      // Check user isn't interacted with input
      (!props.preventFocusedChange || document.activeElement !== autoNumericElement.value)
    ) {
      // The modification comes from a script, so we need to reformat the new value `newValue.value`
      anElement.value.set(newValue.value)
    }
  }
})

onMounted(() => {
  if (autoNumericElement.value) {
    anElement.value = new AutoNumeric(
      autoNumericElement.value,
      props.modelValue,
      clone(initialOptions.value),
    )
    anElement.value.set(props.modelValue)
  }
})

useEventListener(autoNumericElement, 'autoNumeric:rawValueModified', (event) => {
  if (document.activeElement !== autoNumericElement.value) return
  if (anElement.value !== null) {
    emits('update:modelValue', anElement.value.getNumber(), event)
  }
})

function adjustSize() {
  if (autoNumericElement.value instanceof HTMLInputElement) {
    autoNumericElement.value.size = Math.max(1, autoNumericElement.value.value.length)
  }
}

useEventListener(autoNumericElement, 'autoNumeric:formatted', adjustSize, { passive: true })
onMounted(adjustSize)
</script>
