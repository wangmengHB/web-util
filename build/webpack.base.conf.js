const path = require('path')


module.exports = {
    context: path.resolve(__dirname, '../'),
    entry: {
        'web-util': path.resolve(__dirname, '../src/index.js')
    },
    output: {
        path: path.resolve(__dirname, '../dist'),
        filename: '[name].js',
        publicPath: '/',
        libraryTarget: 'umd',
        library: 'WebUtil'
    },
    module: {
        rules: [
          {
            test: /\.jsx?$/,
            loader: 'babel-loader',
            include: [
                path.resolve(__dirname, '../src')
            ]
          },
          {
            test: /\.less$/,
            use: [
              {
                loader: 'style-loader',
              },
              {
                loader: 'css-loader',
              },
              {
                loader: 'less-loader',
                options: {
                  javascriptEnabled: true,
                }
              }
            ]
          },
          {
            test: /\.svg$/,
            loader: 'url-loader'
          }
        ]
    },
    node: {
        setImmediate: false,
        dgram: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
        child_process: 'empty'
    }
}