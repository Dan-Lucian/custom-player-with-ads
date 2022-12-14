const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    context: path.join(__dirname, 'app'),
    entry: {
        player: './js/App.ts',
        init: './js/init.ts'
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: [/node_modules/, /assets/, /dist/]
            },
            {
                test: /\.(scss|css)$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|mp4|bmp|m3u8)$/i,
                type: 'asset/resource'
            },
            {
                test: /\.ts$/,
                type: 'asset/resource',
                include: /assets/
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Production',
            template: path.resolve(__dirname, 'app/index.html'),
            inject: 'body'
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
    }
};
