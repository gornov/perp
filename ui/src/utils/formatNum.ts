import { autoNumericDefaults } from '@/utils/autoNumericDefaults'
import type { Options, RoundingMethodOption } from 'autonumeric'
import AutoNumeric, { type PredefinedOptions } from 'autonumeric'
import { clamp } from 'lodash-es'

// @see http://autonumeric.org/guide
export default function formatNum(
  value: number,
  decimalPlacesOrOptions: number | Options = 2,
  roundingMethod: RoundingMethodOption = 'S',
) {
  const options: Partial<PredefinedOptions> =
    typeof decimalPlacesOrOptions === 'number'
      ? { ...autoNumericDefaults, roundingMethod, decimalPlaces: decimalPlacesOrOptions as number }
      : { ...autoNumericDefaults, ...(decimalPlacesOrOptions as object) }

  value = clamp(value, +(options.minimumValue || 0), +(options.maximumValue || 0))

  return AutoNumeric.format(value, options)
}
