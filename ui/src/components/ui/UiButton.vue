<template>
  <button
    :class="{
      btn: true,
      [`btn--${theme}`]: true,
      [`btn--${size}`]: true,
      'btn--square': !$slots.default,
    }"
    :disabled="disabled || loading"
  >
    <SvgIcon v-if="startIcon" :name="startIcon" class="btn__icon" />
    <span v-if="$slots.default" class="btn__text"><slot /></span>
    <SvgIcon v-if="endIcon" :name="endIcon" class="btn__icon" />
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <SvgIcon class="btn__icon text-main-white" name="ui/spinner" />
    </span>
  </button>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'

withDefaults(
  defineProps<{
    theme?: 'primary' | 'secondary' | 'text'
    size?: 'L' | 'M'
    startIcon?: string
    endIcon?: string
    loading?: boolean
    disabled?: boolean
  }>(),
  {
    theme: 'primary',
    size: 'M',
  },
)
</script>
