import type { PredefinedOptions } from 'autonumeric'

// @see http://autonumeric.org/guide
const autoNumericDefaults: Partial<PredefinedOptions> = {
  digitGroupSeparator: ',', // \u202f',
  currencySymbol: '',
  currencySymbolPlacement: 'p',
  minimumValue: '-99999999999.99',
  maximumValue: '99999999999.99',
  decimalPlaces: 2,
  roundingMethod: 'S',
  allowDecimalPadding: true,
  decimalCharacter: '.',
  decimalCharacterAlternative: ',',
}

export { autoNumericDefaults }
