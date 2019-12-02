const webpack = require('webpack');
const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = () => ({
  entry: {
    index: './src/index.js'
  },
  output: {
    publicPath: './',
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js'
  },
  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx'],
    modules: [path.resolve(__dirname, 'node_modules')]
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            babelrc: true
          }
        }
      }
    ]
  },
  externals: [
    nodeExternals([
      {
        whitelist: ['@actions/github']
      }
    ])
  ],
  plugins: [
    new webpack.NamedModulesPlugin()
  ]
});
