import { camelCase, isArray, isObject, transform } from 'lodash-es'

function numberize(val: unknown) {
  if (
    val &&
    typeof val === 'string' &&
    val.length < 17 &&
    !isNaN(+val) &&
    val.match(/^-?\d+(\.\d+)?(e-?\d+)?$/)
  )
    return +val
  return val
}

function toCamelCase(str: PropertyKey) {
  if (typeof str !== 'string') return str

  if (str === str.toUpperCase() && !str.includes('_')) {
    return str
  }

  return camelCase(str)
}

export const transformResponse = <T extends AnyObject>(obj: AnyObject): T =>
  transform(obj, (acc, value, key, target) => {
    const camelKey = isArray(target) ? key : toCamelCase(key)

    acc[camelKey] = isObject(value) ? transformResponse(value) : numberize(value)
  })
