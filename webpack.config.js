var webpack = require('webpack')
var compact = require('lodash/array/compact')

var optimize = webpack.optimize

var minify = process.env.WEBPACK_MINIFY === 'true'

module.exports = {
  entry: './webpack.entry.js',
  output: {
    path: './dist',
    filename: minify ? 'vulture.min.js' : 'vulture.js',
    library: 'Vulture',
    libraryTarget: 'var'
  },
  target: 'web',
  bail: true,
  plugins: compact([
    new optimize.DedupePlugin(),
    minify ?
    new optimize.UglifyJsPlugin({
      mangle: true,
      comments: false
    }) : null
  ])
}
