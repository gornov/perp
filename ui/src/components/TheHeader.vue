<template>
  <header class="bg-main-black sticky top-0 z-[10] flex w-full items-end px-4 pb-4">
    <div class="flex-1">
      <button
        v-if="router.currentRoute.value.name === 'dashboard'"
        class="flex items-center gap-3"
        @click="router.back()"
      >
        <SvgIcon :size="20" name="ui/arrow-left-02" />
        <span class="text-14-semibold border-stroke bg-main-bg rounded-xl border px-3 py-2">
          Mifunder Evaluation
        </span>
      </button>
      <TabsComponent v-else v-model="navTab" theme="upperline1">
        <TabItem tab-key="propTerminal">
          <SvgIcon :size="24" class="me-2.5" name="ui/flag-square" />
          PROP mode
        </TabItem>
        <TabItem tab-key="trading">
          <SvgIcon :size="24" class="me-2.5" name="ui/status-up" />
          Trading
        </TabItem>
        <TabItem tab-key="earn">
          <SvgIcon :size="24" class="me-2.5" name="ui/arrange-square" />
          Earn
        </TabItem>
      </TabsComponent>
    </div>
    <img alt="logo" class="h-full w-auto" src="@/assets/images/logo.svg?url" />
    <div class="flex flex-1 items-end justify-end gap-3">
      <template v-if="!String(router.currentRoute.value.name).startsWith('portal')">
        <UiButton start-icon="ui/more" theme="secondary" />
        <UiButton end-icon="ui/arrow-right-02" @click="$router.push({ name: 'portalProp' })"
          >Start new challenge
        </UiButton>
      </template>
      <UiButton v-if="!isConnected" @click="showModal">Connect wallet</UiButton>
      <button v-else class="flex items-center gap-2 text-start" @click="adapter?.disconnect()">
        <img :src="adapter?.icon" alt="" class="size-9" />
        <span>
          <span class="block text-12-semibold">0.00 SOL</span>
          <span class="text-12-regular text-main-secondary">
            {{ adapter?.publicKey?.toString().replace(/^(.....).*(....)$/, '$1...$2') }}
          </span>
        </span>
      </button>
    </div>
  </header>
</template>

<script lang="ts" setup>
import SvgIcon from '@/components/ui/icons/SvgIcon.vue'
import TabItem from '@/components/ui/tabs/TabItem.vue'
import TabsComponent from '@/components/ui/tabs/TabsComponent.vue'
import UiButton from '@/components/ui/UiButton.vue'
import useWallet from '@/composables/useWallet.ts'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const navTab = computed({
  get() {
    return router.currentRoute.value.name
  },
  set(value) {
    router.push({ name: value })
  },
})

const { isConnected, adapter, showModal } = useWallet()
</script>
