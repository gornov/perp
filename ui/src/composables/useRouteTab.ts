import type { MaybeRef } from '@vueuse/core'
import { isFunction } from 'lodash-es'
import { computed, unref } from 'vue'
import { useRouter } from 'vue-router'

/**
 * Returns WritableComputedRef mapped to param `tabParamName` on route `routeName`
 */
export default function useRouteTab<T extends string>(
  defaultTab: MaybeRef<T>,
  tabParamName = 'tab',
  params?: unknown | (() => unknown),
  routeName = '',
  options: { replace?: boolean } = {},
) {
  const router = useRouter()

  return computed<T>({
    get: () => {
      const tab = router.currentRoute.value.params[tabParamName] as T
      return tab || unref(defaultTab)
    },
    set: (value) =>
      router[options.replace ? 'replace' : 'push']({
        name: routeName || router.currentRoute.value.name,
        params: {
          ...(isFunction(params) ? params() : params),
          [tabParamName]: value === defaultTab ? '' : value,
        },
      }),
  })
}
