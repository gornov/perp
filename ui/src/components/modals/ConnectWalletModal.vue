<template>
  <div class="py-5">
    <div class="text-20-semibold me-20 mb-3 px-5">Choose wallet</div>
    <template v-if="adapters.length > 0">
      <button
        v-for="adapter in adapters"
        :key="adapter.name"
        class="hover:bg-main-black-bg flex w-full items-center gap-3 px-5 py-2"
        @click="select(adapter.name)"
      >
        <img :src="adapter.icon" alt="" class="size-9" />
        {{ adapter.name }}
      </button>
    </template>
    <div v-else class="px-5 py-10 text-center">No wallets found</div>
  </div>
</template>

<script lang="ts" setup>
import useWallet from '@/composables/useWallet.ts'
import { useModal } from '@/stores/modal.ts'

const modal = useModal()
const { adapters } = useWallet()

function select(name: string) {
  modal.close(name)
}
</script>
