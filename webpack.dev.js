const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
        runtimeChunk: 'single'
    },
    output: {
        filename: '[name].bundle.js',
        assetModuleFilename: 'assets/[name][ext][query]'
    }
});
