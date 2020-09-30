/*
 * @Description: 设置代理
 * @Author: 赵亮（cxpzl.mq@gmail.com）
 * @Date: 2019-09-10 16:29:07
 * @LastEditors: 李沛韬（929498346@qq.com）
 * @LastEditTime: 2019-11-12 15:57:24
 */

module.exports = {
  // 基本路径
  publicPath: './',
  // 输出文件目录
  outputDir: 'dist',
  // webpack-dev-server 相关配置
  devServer: {
    proxy: {
      '/list': {
        target: 'https://agencytest.huisou.cn/list/',
        // target: 'http://192.168.0.128:8888/',
        changeOrigin: true,
        ws: false,
        pathRewrite: {
          '^/list': ''
        }
      }
    }
  }
}