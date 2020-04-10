/**
 * FileName : config-overrides.js
 * ProjectName : myapp
 * Author : terrorblade
 * Created Date: 2020-04-10 10:43:54
 * Description : 
 * -----
 * Last Modified: 2020-04-10 10:55:58
 * Modified By : 
 * -----
 * Copyright (c) 2019 芒果动听 Corporation. All rights reserved.
 */

const { override, fixBabelImports, addLessLoader, addWebpackPlugin } = require('customize-cra');
const AntdDayjsWebpackPlugin = require('antd-dayjs-webpack-plugin');

module.exports = override(
    fixBabelImports('import', {
        libraryName: 'antd',
        libraryDirectory: 'es',
        style: true,
    }),
    addLessLoader({
       javascriptEnabled: true,
       modifyVars: { '@primary-color': '#1890ff' },
    }),
    addWebpackPlugin(new AntdDayjsWebpackPlugin()),
);
