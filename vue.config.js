// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path')

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

    config.module.rules.unshift({
      test: /\.svg$/,
      include: [
        path.resolve(__dirname, 'src/assets/icons')
      ],
      loader: 'raw-loader'
    })
  }
}
