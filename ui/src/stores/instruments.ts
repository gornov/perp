import catchApiError from '@/api/catchApiError.ts'
import instrumentsApi from '@/api/instrumentsApi.ts'
import Instrument from '@/stores/classes/Instrument.ts'
import { keyBy } from 'lodash-es'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const useInstrumentsStore = defineStore('instruments', () => {
  const instruments = ref<Instrument[]>([])
  const instrumentsMap = computed(() => keyBy(instruments.value, 'symbol'))
  const instrumentsIdMap = computed(() => keyBy(instruments.value, 'id'))

  async function fetch() {
    instruments.value = (await catchApiError(() => instrumentsApi.getAll())).map(
      (ri) => new Instrument(ri),
    )
  }

  return { instruments, instrumentsMap, instrumentsIdMap, fetch }
})

export default useInstrumentsStore
