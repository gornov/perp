import {
  isWalletAdapterCompatibleStandardWallet,
  type WalletAdapterCompatibleStandardWallet,
} from '@solana/wallet-adapter-base'
import { getWallets } from '@wallet-standard/app'
import { shallowRef } from 'vue'

const { on, get } = getWallets()
const getCompatible = () => get().filter(isWalletAdapterCompatibleStandardWallet)
const wallets = shallowRef<WalletAdapterCompatibleStandardWallet[]>(getCompatible())
const setWallets = () => (wallets.value = getCompatible())
on('register', setWallets)
on('unregister', setWallets)

export default function useStandardWallets() {
  return wallets
}
