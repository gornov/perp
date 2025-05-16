import catchApiError from '@/api/catchApiError.ts'
import tradesApi from '@/api/tradesApi.ts'
import ActiveTrade from '@/stores/classes/ActiveTrade.ts'
import asleep from '@/utils/asleep.ts'
import { keyBy } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const useActiveTradesStore = defineStore('activeTrades', () => {
  const trades = ref<ActiveTrade[]>([])
  const tradesMap = computed(() => keyBy(trades.value, 'id'))

  async function fetch() {
    trades.value = (await catchApiError(() => tradesApi.get())).map((t) => new ActiveTrade(t))
    await asleep(2000)
    fetch()
  }

  return { trades, tradesMap, fetch }
})

export default useActiveTradesStore
