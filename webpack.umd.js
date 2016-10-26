const webpack = require('webpack')
const path = require('path')
const version = require('./package.json').version

/*eslint-disable */
const banner =
  "/**\n" +
  " * vue-prop-types v" + version + "\n" +
  " * Copyright (c) 2016 Marco Solazzi\n" +
  " * MIT License\n" +
  " */\n";
/*eslint-enable */

const plugins = [
  new webpack.BannerPlugin({ raw: true, banner }),
  new webpack.NoErrorsPlugin(),
  new webpack.DefinePlugin({
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }
  })
]

if (process.env.NODE_ENV === 'production') {
  plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    })
  )
}

module.exports = {

  entry: {
    'vue-prop-types': ['./src/index.js']
  },

  output: {
    library: 'VueProps',
    libraryTarget: 'umd',
    path: path.join(process.cwd(), 'umd'),
    filename: process.env.NODE_ENV === 'production' ? 'vue-prop-types.min.js' : 'vue-prop-types.js',
  },

  plugins: plugins,

  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          path.join(process.cwd(), 'src')
        ],
        use: [
          'babel'
        ]
      }
    ]
  }
}
