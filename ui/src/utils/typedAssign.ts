/**
 * Typesafe wrapper over `Object.assign`, ensures that sources fields are subset of target ones.
 * Useful for reactive state objects.
 */
export default function typedAssign<T extends object>(target: T, ...sources: Partial<T>[]): T {
  return Object.assign(target, ...sources)
}
