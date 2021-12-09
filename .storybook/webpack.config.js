const path = require('path')

module.exports = ({ config: baseConfig }) => {
  baseConfig.module.rules.push({
    test: /\.scss$/,
    loaders: [
      'style-loader',
      'css-loader',
      'sass-loader',
      {
        loader: 'sass-resources-loader',
        options: {
          resources: [
            path.resolve(__dirname, '../src/assets/scss/resources.scss')
          ]
        }
      }
    ],
    include: path.resolve(__dirname, '../')
  })

  baseConfig.resolve.alias = {
    '@': path.resolve(__dirname, '../src')
  }

  return baseConfig
}
