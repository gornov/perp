const styles = getComputedStyle(document.documentElement)
const cache: Record<string, string> = {}

export default function getTheme(key: string) {
  return key in cache ? cache[key] : (cache[key] = styles.getPropertyValue('--' + key))
}
