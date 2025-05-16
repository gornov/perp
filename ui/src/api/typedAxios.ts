import type { transformResponse } from '@/api/transformResponse.ts'
import useUserStore from '@/stores/user.ts'
import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'

let currentAbortController: { value: AbortController | null } = { value: null }

type AxiosRequestConfig2<T = unknown> = AxiosRequestConfig<T> & {
  shouldAuth?: boolean
  customTransformResponse?: typeof transformResponse
}

function enrichConfig(config: AxiosRequestConfig2 = {}) {
  currentAbortController = { value: new AbortController() }
  if (config.shouldAuth) {
    const { token } = useUserStore()
    if (!token) throw new Error('NO_TOKEN')
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }

  return {
    ...config,
    signal: currentAbortController.value?.signal,
  }
}

const typedAxios = {
  get<O = unknown, I = unknown>(url: string, config?: AxiosRequestConfig2<I> | undefined) {
    return axios.get<O>(url, enrichConfig(config))
  },

  post<O = unknown, I = unknown>(
    url: string,
    data?: I,
    config?: AxiosRequestConfig2<I> | undefined,
  ) {
    return axios.post<O>(url, data, enrichConfig(config))
  },

  delete<O = unknown, I = unknown>(url: string, config?: AxiosRequestConfig2<I> | undefined) {
    return axios.delete<O>(url, enrichConfig(config))
  },
}

export const getCurrentAbortController = () => currentAbortController
export default typedAxios
