const webpack = require('webpack');
const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const zlib = require('zlib');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    lib: path.resolve(__dirname, 'src', 'main.ts'),
  },
  output: {
    filename: '[name].js',
    chunkFilename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    jsonpFunction: 'smFastJsonp',
  },
  watchOptions: {
    poll: true,
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js', '.css'],
  },
  plugins: [
    new CleanWebpackPlugin(),

    new CopyWebpackPlugin({
      patterns: [{ from: 'static' }],
    }),

    new webpack.BannerPlugin({
      banner: `
Smarketer TS Library

@copyright 2021 Smarketer GmbH (https://www.smarketer.de/)
@author Smarketer GmbH (Bennett Hollstein)
@license Proprietary, All Rights reserved

This software contains code from open-source projects:
- core-js (https://github.com/zloirock/core-js) licensed under the MIT License
- webpack (https://github.com/webpack/webpack) licensed under the MIT License
- regenerator-runtime (https://www.npmjs.com/package/regenerator-runtime) licensed under the MIT License

A copy of the MIT license can be found at https://opensource.org/licenses/MIT.
A copy of the ISC license can be found at https://opensource.org/licenses/ISC.
`,
      include: ['lib'],
    }),
    // new BundleAnalyzerPlugin(),
  ],
});
