import { reduce } from 'lodash-es'

// made external to speedup SvgIcon setup function
const iconLoaders = reduce(
  import.meta.glob('/src/assets/icons/**/*.svg', {
    query: '?raw',
    import: 'default',
  }) as Record<string, () => Promise<string>>,
  (memo, value, key) => ({
    ...memo,
    [key.split('/icons/')[1].replace(/\.svg$/i, '')]: value,
  }),
  {} as Record<string, () => Promise<string>>,
)

export default iconLoaders
