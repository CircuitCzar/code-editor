const path = require('path');
const commonConfig = require('./webpack.common');
const { merge } = require('webpack-merge');

console.log(path.join(__dirname, 'static'));

const devConfig = {
  mode: 'development',
  devServer: {
    host: '0.0.0.0',
    port: '9000',
    // 设置服务入口，localhost:9000就可以直接访问public和dist里面的资源文件了
    static: path.join(__dirname, '../static'),
  },
  output: {
    path: path.join(__dirname, '../build'),
    filename: 'index.bundle.js',
  },
};

module.exports = (env) => {
  return merge(commonConfig, devConfig);
};
