// @ts-check
const path = require('path')

/** @type {import('webpack').Configuration}*/
const config = {
  mode: 'production',
  entry: {
    Slot5e: './Slot5e/index.js',
    SaltySeas: './SaltySeas/index.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this',
  },
  optimization: {
    minimize: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  externals: {
    underscore: '_',
  },
}
module.exports = config
