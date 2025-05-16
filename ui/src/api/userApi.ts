import typedAxios from '@/api/typedAxios.ts'

const userApi = {
  getSummary() {
    return typedAxios.get<RawUser>('/api/v1/account/summary', { shouldAuth: true })
  },

  getBalance() {
    return typedAxios.get<{ balance: number }>('/api/v1/account/balance', { shouldAuth: true })
  },

  setBalance(balance: number) {
    return typedAxios.post<{ balance: number }>(
      '/api/v1/account/balance',
      { balance: `${balance}` },
      { shouldAuth: true },
    )
  },
}

export default userApi
