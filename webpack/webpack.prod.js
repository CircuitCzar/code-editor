const { merge } = require('webpack-merge');
const commonConfig = require('./webpack.common');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
console.log('a', path.resolve(__dirname, '../static'));
const prodConfig = {
  mode: 'production',
  devtool: 'source-map',
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'index.bundle.js',
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: path.resolve(__dirname, '../static') }],
    }),
  ],
};

module.exports = (env) => {
  return merge(commonConfig, prodConfig);
};
