import useUserStore from '@/stores/user'
import { AxiosError, type AxiosResponse, HttpStatusCode } from 'axios'

export default async function catchApiError<T = unknown>(
  requestCallback: () => Promise<AxiosResponse<T>>,
  dontRefresh = false,
) {
  try {
    const { data } = await requestCallback()
    return data
  } catch (error) {
    if (
      !dontRefresh &&
      ((error instanceof Error && error.message === 'NO_TOKEN') ||
        (error instanceof AxiosError && error.response?.status === HttpStatusCode.Unauthorized))
    ) {
      await useUserStore().auth()
      return await catchApiError(requestCallback, dontRefresh)
    }
    throw error
  }
}
