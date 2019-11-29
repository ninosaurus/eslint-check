const path = require('path');

module.exports = (env, argv) => {
  const config = {
    entry: {
      bundle: './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js'
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
              envName: argv.mode === 'production' ? 'production' : 'development'
            }
          }
        },
        {
          test: /\.js$/,
          exclude: (/node_modules|dist/),
          use: ['eslint-loader']
        }
      ]
    }
  };

  return config;
};
