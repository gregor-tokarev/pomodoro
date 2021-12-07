module.exports = {
  css: {
    loaderOptions: {
      scss: {
        prependData: '@import "~@/assets/scss/main.scss";'
      }
    }
  },
  configureWebpack: config => {
    const rules = config.module.rules
    const svgRuleIndex = rules.findIndex(rule => rule.test.toString() === /\.(svg)(\?.*)?$/.toString())
    rules.splice(svgRuleIndex, 1)

    config.module.rules.push({
      test: /\.svg$/,
      loader: 'raw-loader'
    })
    // module: {
    //   rules: [
    //     {
    // test: /\.svg$/,
    // use: [
    //   {
    //     loader: 'html-loader'
    //   }
    // ]
    // }
    // ]
    // }
  }
}
