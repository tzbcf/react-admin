const { whenProd } = require('@craco/craco');
const CracoAntDesignPlugin = require('craco-antd');
const SimpleProgressWebpackPlugin = require('simple-progress-webpack-plugin');
const webpack = require('webpack');
const HappyPack = require('happypack');
const path = require('path');
const os = require('os');
const CracoLessPlugin = require('craco-less');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const smp = new SpeedMeasurePlugin();
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length });

module.exports = {
    webpack: {
        alias: {
            '@': path.resolve('src'),
        },
        module: {
            rules: [
                {
                    test: /\.(jsx|js|ts|tsx)$/,
                    include: [ path.resolve(__dirname, './src') ],
                    exclude: [ /node_modules/ ],
                    use: [ 'eslint-loader' ],
                    enforce: 'pre',
                },
                {
                    test: /\.(png|svg|jpg|gif|woff|woff2|svg|eot|ttf)$/,
                    loader: 'url-loader?limit=1024&name=[path][name].[ext]&outputPath=img/&publicPath=output/url-loader?limit=8192&&name=img/[name].[ext]',
                },
            ],
        },
        plugins: smp.wrap([
            new webpack.DefinePlugin({
                'process.env.BASE_URL': JSON.stringify(process.env.BASE_URL),
            }),
            new HappyPack({
                // 用唯一的标识符 id 来代表当前的 HappyPack 是用来处理一类特定的文件
                id: 'babel',
                // 如何处理 .js 文件，用法和 Loader 配置中一样
                // 注意：loaders 是 use 的别名
                loaders: [
                    {
                        loader: 'babel-loader',
                        options: {
                            // 2.使用bable,新语法转成es5语法
                            presets: [ '@babel/preset-env' ],
                        },
                    },
                ],
                // ... 其它配置项
                threads: os.cpus().length,
                // 使用共享进程池中的子进程去处理任务
                threadPool: happyThreadPool,
                // ... 其它配置项
            }),
            new HappyPack({
                id: 'css',
                // 如何处理 .css 文件，用法和 Loader 配置中一样
                loaders: [
                    {
                        loader: 'style-loader',
                        options: {},
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            url: true,
                            import: true,
                        },
                    },
                ], // 给css-loader传递参数 ?minimize
                // ... 其它配置项
                threads: os.cpus().length,
                // 使用共享进程池中的子进程去处理任务
                threadPool: happyThreadPool,
            }),
            new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
            new SimpleProgressWebpackPlugin(),
            new CompressionWebpackPlugin({
                // gzip打包
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                // test: /\.js$|\.html$|\.json$|\.css/,
                test: /\.js$|\.json$|\.css/,
                threshold: 10240, // 只有大小大于该值的资源会被处理
                minRatio: 0.8, // 只有压缩率小于这个值的资源才会被处理
                // deleteOriginalAssets: true // 删除原文件
            }),
            ...whenProd(() => [ new BundleAnalyzerPlugin() ], []),
        ]),
        // 抽离公用模块
        optimization: {
            splitChunks: {
                chunks: 'all',
                minSize: 30000,
                minChunks: 1,
                maxAsyncRequests: 5,
                maxInitialRequests: 3,
                minimizer: [
                    new TerserPlugin({
                        parallel: true,
                        terserOptions: {
                            compress: {
                                // eslint-disable-next-line camelcase
                                pure_funcs: [ 'console.log' ],
                            },
                        },
                    }),
                ],
                cacheGroups: {
                    commons: {
                        name: 'common',
                        chunks: 'all',
                        minChunks: 2,
                        minSize: 0,
                    },
                    vendor: {
                        test: /node_modules/,
                        chunks: 'all',
                        name: 'vendor',
                        reuseExistingChunk: true,
                        enforce: true,
                    },
                },
            },
        },
        configure: (webpackConfig, { env }) => {
            if (env === 'production') { // 线上打包去除map
                webpackConfig.devtool = 'none';
            }
            return webpackConfig;
        },
    },
    devServer: {
        inline: true,
        port: 3000,
        proxy: {
            '/v1': {
                target: 'http://58.20.54.85:9085', // 192.168.182.81:8080 http://172.20.8.146:9085/ 58.20.54.85
                secure: true,
                changeOrigin: true,
                // pathRewrite: {
                //     '^/v2': '/v1',
                // },
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
                    '@primary-color': '#3AB17A',
                    '@bg-color': '#3AB17A',
                    '@ant-layout-sider': '#FAFAFA',
                },
            },
        },
        {
            plugin: CracoLessPlugin,
            options: {
                modifyLessRule: () => ({
                    test: /\.less$/,
                    use: [ 'style-loader', 'css-loader', 'less-loader' ],
                }),
            },
        },
    ],
};
