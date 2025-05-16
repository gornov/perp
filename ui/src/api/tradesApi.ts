import typedAxios from '@/api/typedAxios'
import type { RawActiveTrade } from '@/stores/classes/ActiveTrade.ts'

const tradesApi = {
  create(symbol: string, amount: number, leverage: number, side: 'buy' | 'sell') {
    return typedAxios.post(
      '/api/v1/position',
      {
        symbol,
        margin: `${amount}`,
        leverage,
        side,
      },
      { shouldAuth: true },
    )
  },

  close(id: number) {
    return typedAxios.post<{ nonce: string }>(
      '/api/v1/position/close',
      { position_id: id },
      { shouldAuth: true },
    )
  },

  get(query?: { symbol?: string }) {
    const qs = query?.symbol ? `?symbol=${query.symbol}` : ''
    return typedAxios.get<RawActiveTrade[]>(`/api/v1/positions${qs}`, { shouldAuth: true })
  },
}

export default tradesApi
