const path = require('path');

module.exports = (env, argv) => {
  return {
    entry: {
      index: './src/index.js'
    },
    target: 'async-node',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'index.js'
    },
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
        }
      ]
    }
  };
};
