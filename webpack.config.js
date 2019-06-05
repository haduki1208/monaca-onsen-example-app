const webpack = require('webpack');
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');

const path = require('path');
const argvs = require('yargs').argv;
const devMode = process.env.WEBPACK_SERVE || argvs.mode === 'development';

const DEFAULT_PORT = 8080;
const host = process.env.MONACA_SERVER_HOST || argvs.host || '127.0.0.1';
const port = argvs.port || DEFAULT_PORT;
const wss = process.env.MONACA_TERMINAL ? true : false;
const socketPort = port + 1; //it is used for webpack-hot-client

let webpackConfig = {
  mode: devMode ? 'development' : 'production',
  entry: {
    app: ['./src/main.tsx']
  },

  output: {
    path: path.resolve(__dirname, 'www'),
    filename: '[name].js'
  },

  optimization: {
    removeAvailableModules: true,
    splitChunks: {
      chunks: 'all'
    },
    runtimeChunk: true,
    removeEmptyChunks: true,
    providedExports: true
  },

  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json', '.css', '.scss', '.html', '.styl'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-typescript', '@babel/preset-react', '@babel/preset-env'],
              plugins: devMode
                ? ['react-hot-loader/babel', '@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
                : ['@babel/proposal-class-properties', '@babel/proposal-object-rest-spread']
            }
          }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?\S*)?$/,
        loader: 'file-loader?name=assets/[name].[hash].[ext]'
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 1 }
          },
          {
            loader: 'postcss-loader',
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.scss$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: { importLoaders: 2 }
          },
          {
            loader: 'sass-loader'
          },
          {
            loader: 'postcss-loader',
            options: {
              sourceMap: true,
              plugins: [
                require('autoprefixer')({
                  grid: true
                })
              ]
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[name].css'
    }),
    new ProgressBarPlugin()
  ],

  resolveLoader: {
    modules: ['node_modules']
  },

  performance: {
    hints: false
  }
};

// Development mode
if (devMode) {
  webpackConfig.devtool = 'eval';

  webpackConfig.serve = {
    port: port,
    host: host,
    devMiddleware: {
      publicPath: '/',
      stats: {
        colors: true,
        errorDetails: true,
        performance: true,
        source: true,
        warnings: true,
        builtAt: true
      }
    },
    hotClient: {
      port: socketPort,
      https: wss
    }
  };

  let devPlugins = [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs',
      chunksSortMode: 'dependency'
    })
  ];

  webpackConfig.plugins = webpackConfig.plugins.concat(devPlugins);
} else {
  // Production mode
  let prodPlugins = [
    new HtmlWebPackPlugin({
      template: 'src/public/index.html.ejs',
      chunksSortMode: 'dependency',
      externalCSS: ['components/loader.css'],
      externalJS: ['components/loader.js'],
      minify: {
        caseSensitive: true,
        collapseWhitespace: true,
        conservativeCollapse: true,
        removeAttributeQuotes: true,
        removeComments: true
      }
    })
  ];
  webpackConfig.plugins = webpackConfig.plugins.concat(prodPlugins);
}

module.exports = webpackConfig;
