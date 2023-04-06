const path = require('path');

module.exports = {
  //mode: 'production',
  mode: 'development',
  devtool: 'source-map', // disable for production
  entry: {
    index: './src/js/index.ts',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, 'public/js'),
    clean: true,
  }
};