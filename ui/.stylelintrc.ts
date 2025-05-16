import type stylelint from 'stylelint'

function trbl(prop: string, postfix: string = '') {
  return [
    `${prop}${postfix}`,
    ...['top', 'right', 'bottom', 'left'].map((side) => `${prop}-${side}${postfix}`),
  ]
}

function startend(prop: string, type: string) {
  return [`${prop}-${type}`, `${prop}-${type}-start`, `${prop}-${type}-end`]
}

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-tailwindcss'],
  plugins: ['stylelint-order'],
  overrides: [
    {
      files: ['**/*.vue'],
      customSyntax: 'postcss-html',
      rules: {
        'selector-pseudo-class-no-unknown': [
          true,
          {
            ignorePseudoClasses: ['global', 'deep'],
          },
        ],
      },
    },
  ],

  ignoreFiles: ['**/*', '!src/**/*.{css,vue}'],
  rules: {
    'at-rule-no-unknown': null,
    'at-rule-no-deprecated': null,
    'keyframes-name-pattern': null,
    'selector-class-pattern': null,
    'selector-id-pattern': null,
    'value-keyword-case': null,
    'property-no-unknown': [true, { ignoreProperties: ['text-fill-color'] }],
    'declaration-block-no-duplicate-properties': true,
    'no-descending-specificity': null,
    'number-max-precision': null,
    'declaration-block-no-redundant-longhand-properties': null,
    'max-nesting-depth': 4,

    'order/order': [
      'dollar-variables', // $var
      'custom-properties', // --var
      'declarations',
      'rules',
    ],

    'order/properties-order': [
      [
        'content',

        // позиционирование
        'position',
        'top',
        'right',
        'bottom',
        'left',
        ...startend('inset', 'block'),
        ...startend('inset', 'inline'),
        'z-index',

        // отображение, положение в потоке
        'display',
        'direction',
        'visibility',
        'float',
        'clear',
        'overflow',
        'overflow-x',
        'overflow-y',
        'clip',

        // размерность
        ...trbl('margin'),
        ...startend('margin', 'block'),
        ...startend('margin', 'inline'),
        ...trbl('padding'),
        ...startend('padding', 'block'),
        ...startend('padding', 'inline'),
        'min-width',
        'max-width',
        'width',
        'min-height',
        'max-height',
        'height',
        'box-sizing',

        // flex
        'order',
        'flex',
        'flex-direction',
        'flex-grow',
        'flex-shrink',
        'flex-basis',
        'flex-flow',
        'flex-wrap',
        'align-content',
        'align-items',
        'align-self',
        'justify-content',
        'justify-items',
        'justify-self',
        'place-content',
        'place-items',
        'place-self',

        // grid-related
        'grid',
        'grid-area',
        'grid-template',
        'grid-template-areas',
        'grid-template-rows',
        'grid-template-columns',
        ...startend('grid', 'row'),
        ...startend('grid', 'column'),
        'grid-auto-rows',
        'grid-auto-columns',
        'grid-auto-flow',
        'grid-gap',
        'grid-row-gap',
        'grid-column-gap',
        'gap',
        'row-gap',
        'column-gap',

        // columns-related
        'column-count',
        'column-fill',
        'column-rule',
        'column-rule-color',
        'column-rule-style',
        'column-rule-width',
        'column-span',
        'column-width',
        'columns',

        // transform
        'transform',
        'transform-origin',
        'transform-style',
        'perspective',
        'perspective-origin',
        'backface-visibility',

        // стилистика таблиц, список
        'list-style',
        'list-style-image',
        'list-style-position',
        'list-style-type',
        'outline',
        'outline-color',
        'outline-offset',
        'outline-style',
        'outline-width',
        'table-layout',
        'border-spacing',
        'border-collapse',
        'caption-side',
        'empty-cells',

        // цветовое оформление
        'background',
        'background-image',
        'background-position',
        'background-attachment',
        'background-repeat',
        'background-color',
        'background-clip',
        'background-origin',
        'background-size',
        ...trbl('border'),
        ...trbl('border', '-width'),
        ...trbl('border', '-style'),
        ...trbl('border', '-color'),
        'border-radius',
        'border-top-left-radius',
        'border-top-right-radius',
        'border-bottom-right-radius',
        'border-bottom-left-radius',
        'border-image',
        'border-image-outset',
        'border-image-repeat',
        'border-image-slice',
        'border-image-source',
        'border-image-width',
        'box-shadow',
        'color',
        'opacity',

        // текст, шрифты
        'cursor',
        'font',
        'font-family',
        'font-size',
        'line-height',
        'font-style',
        'font-weight',
        'font-variant',
        'font-size-adjust',
        'font-stretch',
        'text-align',
        'text-align-last',
        'text-decoration',
        'text-decoration-color',
        'text-decoration-line',
        'text-decoration-style',
        'text-indent',
        'text-shadow',
        'text-transform',
        'text-justify',
        'text-overflow',
        'vertical-align',
        'white-space',
        'letter-spacing',
        'word-spacing',
        'word-wrap',
        'word-break',

        // animations and transitions
        'transition',
        'transition-delay',
        'transition-duration',
        'transition-property',
        'transition-timing-function',
        'animation',
        'animation-delay',
        'animation-direction',
        'animation-duration',
        'animation-fill-mode',
        'animation-iteration-count',
        'animation-name',
        'animation-play-state',
        'animation-timing-function',

        // unspecified
        'page-break-after',
        'page-break-before',
        'page-break-inside',
        'quotes',
        'resize',
        'tab-size',
      ],
    ],
  },
} satisfies stylelint.Config
