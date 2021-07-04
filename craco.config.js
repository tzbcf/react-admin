const { whenProd } = require('@craco/craco');
const CracoAntDesignPlugin = require('craco-antd');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const webpack = require('webpack');
const path = require('path');
const CracoLessPlugin = require('craco-less');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const smp = new SpeedMeasurePlugin();

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve('src'),
    },
    plugins: smp.wrap([
      new webpack.DefinePlugin({
        'process.env.PROJECT_TYPE': JSON.stringify(process.env.PROJECT_TYPE),
      }),
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new SimpleProgressWebpackPlugin(),
      ...whenProd(() => [new BundleAnalyzerPlugin()],[]),
    ]) ,
    //抽离公用模块
    optimization: {
      splitChunks: {
        cacheGroups: {
          commons: {
            chunks: 'initial',
            minChunks: 2,
            maxInitialRequests: 5,
            minSize: 0,
          },
          vendor: {
            test: /node_modules/,
            chunks: 'initial',
            name: 'vendor',
            priority: 10,
            enforce: true,
          },
        },
      },
    },
  },
  // babel: {
  //   plugins: [
  //     ['import', { libraryName: 'antd', libraryDirectory: 'es', style: 'css' }],
  //     ['@babel/plugin-proposal-decorators', { legacy: true }],
  //   ],
  // },
  plugins: [
    {
      plugin: CracoAntDesignPlugin,
      options: {
        customizeTheme: {
          '@primary-color': '#001529',
        },
      },
    },
    {
      plugin: CracoLessPlugin,
      options: {
        modifyLessRule: () => {
          return {
            test: /\.less$/,
            use: ['style-loader', 'css-loader', 'less-loader'],
          };
        },
      },
    },
  ],
};
