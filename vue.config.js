// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StylelintWebpackPlugin = require('stylelint-webpack-plugin')

module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/scss/resources.scss";'
      }
    }
  },
  configureWebpack: config => {
    const rules = config.module.rules

    const svgRuleIndex = rules.findIndex(rule => rule.test.toString() === /\.(svg)(\?.*)?$/.toString())
    rules[svgRuleIndex].exclude = [
      path.resolve(__dirname, 'src/assets/icons')
    ]

    rules.unshift({
      test: /\.svg$/,
      include: [
        path.resolve(__dirname, 'src/assets/icons')
      ],
      loader: 'raw-loader'
    })

    rules.push({
      resourceQuery: /blockType=i18n/,
      type: 'javascript/auto',
      loader: '@intlify/vue-i18n-loader'
    })

    config.plugins.push(
      new StylelintWebpackPlugin({
        files: ['src/**/*.{vue,scss}'],
        cache: true,
        fix: true,
        emitError: true,
        emitWarning: true
      })
    )
  }
}
