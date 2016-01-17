var webpack = require('webpack')
var compact = require('lodash/compact')
var pkg = require('./package.json')

var optimize = webpack.optimize

var minify = process.env.MINIFY === 'true'

var banner = [
  'Vulture ' + pkg.version,
  '(c) 2016 Caleb Meredith',
  'Released under the MIT License.'
].join('\n')

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
    new webpack.BannerPlugin(banner),
    new optimize.DedupePlugin(),
    minify ? new optimize.UglifyJsPlugin({
      mangle: true,
      comments: /\(c\) 2016 Caleb Meredith/
    }) : null
  ])
}
