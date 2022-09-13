const path = require('path');

module.exports = {
    mode: 'development',
    context: path.join(__dirname, 'app'),
    entry: [
        './js/app.js',
    ],
    output: {
        path: path.join(__dirname, 'public'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader',
                ],
            },
        ],
    },
};