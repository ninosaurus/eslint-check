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
    filename: 'index.js',
    libraryTarget: 'umd',
    globalObject: 'this'
  },
  target: 'node',
  resolve: {
    extensions: ['.js', '.jsx']
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
    nodeExternals()
  ],
  plugins: [
    new webpack.NamedModulesPlugin()
  ]
});
