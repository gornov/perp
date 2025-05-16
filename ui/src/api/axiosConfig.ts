import { transformResponse } from '@/api/transformResponse'
import safeJSON from '@/utils/safeJSON'
import axios, { type AxiosResponseHeaders, type InternalAxiosRequestConfig } from 'axios'

axios.defaults.transformResponse = function (
  this: InternalAxiosRequestConfig & { customTransformResponse?: typeof transformResponse },
  data: string,
  _headers: AxiosResponseHeaders,
  _status?: number,
) {
  return (this.customTransformResponse || transformResponse)(safeJSON.parse(data, {}))
}

axios.defaults.baseURL = 'https://a.mksteps.com'
