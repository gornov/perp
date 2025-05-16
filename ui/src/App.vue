<script lang="ts" setup>
import TheHeader from '@/components/TheHeader.vue'
import TheModalWrapper from '@/components/TheModalWrapper.vue'
import useWallet from '@/composables/useWallet.ts'
import useActiveTradesStore from '@/stores/activeTrades.ts'
import useInstrumentsStore from '@/stores/instruments.ts'
import useUserStore from '@/stores/user.ts'
import { watchEffect } from 'vue'

const { isConnected } = useWallet()
const userStore = useUserStore()
watchEffect(async () => {
  if (isConnected.value && userStore.token) {
    await useInstrumentsStore().fetch()
    await useActiveTradesStore().fetch()
    await useUserStore().fetch()
  }
})
</script>

<template>
  <TheHeader />
  <main class="overflow-hidden">
    <div class="px-4">
      <RouterView v-slot="{ Component }">
        <template v-if="Component">
          <Component :is="Component" />
        </template>
      </RouterView>
    </div>
  </main>
  <TheModalWrapper />
</template>
