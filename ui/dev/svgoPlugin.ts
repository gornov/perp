import { promises as fs } from 'fs'
import type { Config } from 'svgo/lib/svgo'
import { optimize as optimizeSvg } from 'svgo/lib/svgo'
import type { Plugin } from 'vite'

export default function svgoPlugin({ svgoConfig }: { svgoConfig?: Config } = {}): Plugin {
  const svgRegex = /\.svg(\?.+)?$/

  return {
    name: 'svg-loader',
    enforce: 'pre',

    async load(id) {
      if (!id.match(svgRegex)) {
        return
      }

      const [path, queryStr] = id.split('?', 2)
      const query = queryStr?.split('&') || []

      if (query.includes('url')) {
        return // Use default svg loader
      }

      let svg

      try {
        svg = await fs.readFile(path, 'utf-8')
      } catch (_ex) {
        console.warn(
          '\n',
          `${id} couldn't be loaded by vite-svg-loader, fallback to default loader`,
        )
        return
      }

      const svgId = path.replace(/.*\/assets\/(.*)\.svg.*/, '$1')
      svg = optimizeSvg(svg, {
        ...svgoConfig,
        path: svgId.replace(/\//g, '_'),
        multipass: true,
        plugins: ['preset-default', 'removeDimensions', 'cleanupIds', 'prefixIds'],
      }).data

      return `export default ${JSON.stringify(svg)}`
    },
  }
}
