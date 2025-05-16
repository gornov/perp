import ConnectWalletModal from '@/components/modals/ConnectWalletModal.vue'
import useStandardWallets from '@/composables/useStandardWallets.ts'
import { useModal } from '@/stores/modal.ts'
import useUserStore from '@/stores/user.ts'
import { StandardWalletAdapter } from '@solana/wallet-standard-wallet-adapter-base'
import { useLocalStorage } from '@vueuse/core'
import { computed, triggerRef, watch } from 'vue'

const LS_KEY = 'walletName'
const walletName = useLocalStorage(LS_KEY, '')

const wallets = useStandardWallets()

const adapters = computed(() =>
  wallets.value.map((wallet) => new StandardWalletAdapter({ wallet })),
)

const adapter = computed(() => adapters.value.find((adapter) => adapter.name === walletName.value))

if (adapter.value && !adapter.value.connecting && !adapter.value.connected) {
  adapter.value.autoConnect()
}

const isConnected = computed(() => !!adapter.value?.connected)

watch(
  adapter,
  (newAdapter, prev, onCleanup) => {
    if (prev?.connected) prev.disconnect()
    const trigger = () => triggerRef(adapter)
    newAdapter?.on('connect', trigger)
    newAdapter?.on('disconnect', trigger)
    onCleanup(() => {
      newAdapter?.off('connect', trigger)
      newAdapter?.off('disconnect', trigger)
    })
  },
  { immediate: true },
)

async function connectTo(name: string) {
  walletName.value = name
  try {
    await adapter.value?.connect()
    await useUserStore().auth()
  } catch (e) {
    walletName.value = ''
    throw e
  }
}

async function showModal() {
  const modal = useModal()
  try {
    const { detail: walletName } = await modal.open<string>(ConnectWalletModal)
    if (!walletName) return false
    await connectTo(walletName)
    return isConnected.value
  } catch (e) {
    console.warn(e)
    return false
  }
}

export default function useWallet() {
  return { adapter, adapters, connectTo, showModal, isConnected }
}
