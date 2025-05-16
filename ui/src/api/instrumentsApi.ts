import typedAxios from '@/api/typedAxios'
import type { RawInstrument } from '@/stores/classes/Instrument.ts'
import { forIn } from 'lodash-es'

const instrumentsApi = {
  getAll() {
    return typedAxios.get<RawInstrument[]>('/api/v1/instruments', {
      shouldAuth: true,
    })
  },

  getPrice(symbol: string) {
    return typedAxios.get<{ symbol: string; price: number }>(`/api/v1/quote?symbol=${symbol}`, {
      shouldAuth: true,
    })
  },

  getHistoryQuotes(
    symbol: string,
    resolution: string,
    params: {
      startTime?: number
      endTime?: number
      count?: number
    } = {},
  ) {
    const qs = new URLSearchParams(
      forIn(
        {
          ...params,
          symbol,
          interval: resolution,
        },
        (v) => String(v),
      ) as unknown as Record<string, string>,
    )
    let url = '/api/v1/candles'
    if (qs.size) {
      url = url + '?' + qs.toString()
    }

    // return Promise.resolve({
    //   data: {
    //     history: Array(params.count || 2000)
    //       .fill(null)
    //       .map((_, i) => ({
    //         t: (params.to || Date.now()) - ((params.count || 2000) - i) * 60000,
    //         o: '' + Math.random() * 1000,
    //         h: '' + Math.random() * 1000,
    //         l: '' + Math.random() * 1000,
    //         c: '' + Math.random() * 1000,
    //         v: '' + Math.random() * 1000,
    //       })),
    //   },
    //   status: 200,
    //   statusText: 'OK',
    //   headers: new AxiosHeaders(),
    //   config: {},
    // } as AxiosResponse<{ history: IHistoryQuote[] }>)

    return typedAxios.get<IHistoryQuote[]>(url, { shouldAuth: true })
  },
}

export default instrumentsApi
