import authApi from '@/api/authApi.ts'
import catchApiError from '@/api/catchApiError.ts'
import userApi from '@/api/userApi.ts'
import useWallet from '@/composables/useWallet.ts'
import asleep from '@/utils/asleep.ts'
import typedAssign from '@/utils/typedAssign.ts'
import { useLocalStorage } from '@vueuse/core'
import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

interface Goals {
  initBalance: number
  profitGoal: number
  maxLoss: number
  maxDayLoss: number
}

const useUserStore = defineStore('user', () => {
  const token = useLocalStorage('token', '')
  const state = reactive<RawUser & Goals>({
    maxDayLoss: 5000,
    initBalance: 100000,
    maxLoss: 10000,
    profitGoal: 8000,
    balance: 0,
    equity: 0,
    freeFunds: 0,
    marginLevel: 0,
    totalMargin: 0,
    totalPl: 0
  })

  // const currentChallenge = computed<Partial<Challenge>>(() => {})
  async function auth() {
    const { adapter } = useWallet()
    if (!adapter.value?.publicKey) throw new Error('Wallet not connected')
    // @ts-expect-error ---
    const publicKey = adapter.value.publicKey!.toString('base64')
    const nonce = (await authApi.getNonce(publicKey)).data.nonce
    const signature = (await adapter.value.signMessage?.(Uint8Array.from(nonce)))!.toString(
      // @ts-expect-error ---
      'base64',
    )
    token.value = (await authApi.verify(publicKey, signature)).data.token
  }

  async function fetch() {
    typedAssign(state, await catchApiError(() => userApi.getSummary()))
    await asleep(2000)
    fetch()
  }

  return { ...toRefs(state), auth, token, fetch }
})

export default useUserStore
