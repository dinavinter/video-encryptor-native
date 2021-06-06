/**
 * Base webpack config used across other specific configs
 */

import path from 'path';
import webpack from 'webpack';
import {dependencies as externals} from '../../src/package.json';

export default {
  externals: [...Object.keys(externals || {})],

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.worker\.(c|m)?js$/i,
        use: {
          loader: "worker-loader",
          options: {
            esModule: false,
          }
        },
      }, {
        test: /\.html$/,
        use: {
          loader: "html-loader"

        },
      },
      // {
      //   test: /\.css$/i,
      //   include: path.join(__dirname, 'src/components'),
      //   use: [
      //     'style-loader',
      //     {
      //       loader: 'typings-for-css-modules-loader',
      //       options: {
      //         modules: true,
      //         namedExport: true
      //       }
      //     }
      //   ]
      // }
    ],
  },

  output: {
    path: path.join(__dirname, '../../src'),
    // https://github.com/webpack/webpack/issues/1114
    libraryTarget: 'commonjs2',
  },

  /**
   * Determine the array of extensions that should be used to resolve modules.
   */
  resolve: {
    extensions: ['.js', '.jsx', '.json', '.ts', '.tsx'],
    modules: [path.join(__dirname, '../../src'), 'node_modules'],
  },

  plugins: [
    new webpack.EnvironmentPlugin({
      NODE_ENV: 'production',
    }),
  ],
};
