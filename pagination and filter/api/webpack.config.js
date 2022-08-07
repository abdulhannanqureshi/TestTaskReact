const path = require('path');
const { NODE_ENV = 'production' } = process.env;
const nodeExternals = require('webpack-node-externals');
var CopyWebpackPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');
module.exports = {
  entry: './app/app.ts',
  mode: NODE_ENV,
  externals: [nodeExternals()],
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'app.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
    ],
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'app/emailtemplates', to: 'emailtemplates' },
    ]),
    new Dotenv(),
    new CopyWebpackPlugin([{ from: 'app/uploads', to: 'uploads' }]),
    new CopyWebpackPlugin([{ from: 'app/public', to: 'public' }]),
    new CopyWebpackPlugin([{ from: './package.json', to: './' }]),
    new CopyWebpackPlugin([{ from: './swagger.json', to: './' }]),
  ],
};
