<template>
  <SvgIcon :name="`asset/${name}`" :size="props.size" color="native" fallback="asset/default" />
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'

const props = withDefaults(defineProps<{ name: string; size?: number }>(), { size: 20 })
</script>
