var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './index.js',
  output: {
    path: __dirname + '/public',
    filename: 'bundle.js',
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: './index.html' },
      {
        from: './node_modules/spectre.css/dist/spectre.min.css',
        to: './styles.css'
      }
    ])
  ],
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/,
      }
    ]
  }
};
