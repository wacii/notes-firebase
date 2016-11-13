module.exports = {
  entry: './index.js',
  output: {
    directory: __dirname + '/build',
    filename: 'bundle.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules|firebaseui-web/,
      }
    ]
  }
};
