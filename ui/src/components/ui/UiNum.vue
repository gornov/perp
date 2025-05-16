<script lang="ts">
import formatNum from '@/utils/formatNum.ts'
import { defineComponent, h } from 'vue'

export default defineComponent({
  props: {
    colorize: { type: Boolean },
    plus: { type: Boolean },
    precision: { type: Number, default: 2 },
    nozeroes: { type: Boolean },
    prefix: { type: String, default: '' },
    postfix: { type: String, default: '' },
  },
  setup: (props, { slots }) => {
    return () => {
      const input = +(slots.default?.()?.[0]?.children as string)
      const isNumeric = !Number.isNaN(input)
      const formattedNum = isNumeric
        ? formatNum(+input, {
            decimalPlaces: props.precision,
            showPositiveSign: props.plus,
            allowDecimalPadding: !props.nozeroes,
          })
        : '—'
      const classes =
        isNumeric && props.colorize
          ? input > 0
            ? 'text-accent-green'
            : input < 0
              ? 'text-accent-red'
              : ''
          : ''

      const prefixedNum = formattedNum.match(/^[+-]/)
        ? formattedNum.replace(/([+-])(.*)/, `$1${props.prefix}$$2`)
        : `${props.prefix}${formattedNum}`
      return h('span', { class: classes }, `${prefixedNum}${props.postfix}`)
    }
  },
})
</script>
