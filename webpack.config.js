const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTemplate = require('html-webpack-template');
const merge = require('webpack-merge');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');
const SystemBellPlugin = require('system-bell-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const NyanProgressPlugin = require('nyan-progress-webpack-plugin');
const DashboardPlugin = require('webpack-dashboard/plugin');
const ReactStaticPlugin = require('react-static-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');

const parts = require('./webpack.parts');

let env = process.env.NODE_ENV || 'development';
const host = process.env.HOST;
const port = process.env.PORT;

const PATHS = {
  src: path.join(__dirname, 'src'),
  public: path.join(__dirname, 'public')
};

const common = merge([
  {
    plugins: [
      new HtmlWebpackPlugin({
        template: path.join(__dirname, './src/index.html'),
        filename: 'index.html',
        production: env === 'production',
        inject: 'body'
      }),
      new SystemBellPlugin(),
      new FriendlyErrorsWebpackPlugin(),
      new NyanProgressPlugin(),
      new DashboardPlugin(),
      new ManifestPlugin()
    ]
  }
]);

module.exports = myenv => {
  process.env.BABEL_ENV = myenv;

  if (myenv === 'production') {
    return merge([
      common,
      {
        entry: {
          // hmr: [
          //   // Include the client code.
          //   // Note how the host/port setting maps here.
          //   'webpack-dev-server/client?http://' + process.env.HOST + ':' + process.env.PORT,
          //
          //   // Hot reload only when compiled successfully
          //   'webpack/hot/only-dev-server'
          //
          //   // Alternative with refresh on failure
          //   // 'webpack/hot/dev-server',
          // ],
          app: PATHS.src
        },
        output: {
          // TODO: publicPath: to_gitlab_deploy (see webpack-deploy package)
          path: PATHS.public,
          chunkFilename: 'scripts/[chunkhash].js',
          filename: '[name].[chunkhash].js'
        },
        plugins: [
          new webpack.HashedModuleIdsPlugin(),
          new webpack.LoaderOptionsPlugin({
            minimize: true,
            debug: false,
            postcss: {}
          }),
          new ReactStaticPlugin({
            routes: PATHS.src + '/routes.js',
            template: PATHS.src + '/template.js'
          })
        ],
        recordsPath: 'records.json'
      },
      // parts.dontParse({
      //   name: 'react',
      //   path: path.join(__dirname, 'node_modules', 'react', 'dist', 'react.min.js')
      // }),
      parts.setFreeVariable(
        'process.env.NODE_ENV',
        'production'
      ),
      parts.clean(PATHS.public),
      parts.loadFiles(),
      parts.loadJavascript30(PATHS.src, PATHS.public),
      parts.loadJavaScript(PATHS.src),
      parts.minifyJavaScript({ useSourceMap: true }),
      parts.extractBundles([
        {
          name: 'vendor',
          entries: ['whatwg-fetch', 'react', 'react-dom', 'react-router']
        },
        {
          name: 'manifest' // used for not hashing vendor bundle on code change (removes the manifest which changes)
        }
      ]),
      parts.generateSourcemaps('source-map'),
      parts.extractCSS(),
      parts.purifyCSS({
        paths: PATHS.src
      }),
      parts.compress()
    ])
  }

  return merge([
    common,
    {
      entry: [
        // hmr: [
        //   // Include the client code.
        //   // Note how the host/port setting maps here.
        //   'webpack-dev-server/client?http://' + process.env.HOST + ':' + process.env.PORT,
        //
        //   // Hot reload only when compiled successfully
        //   'webpack/hot/only-dev-server'
        //
        //   // Alternative with refresh on failure
        //   // 'webpack/hot/dev-server',
        // ],
        'react-hot-loader/patch',
        PATHS.src
      ],
      plugins: [
        new webpack.NamedModulesPlugin()
      ]
    },
    parts.loadFiles(),
    parts.loadJavaScript(PATHS.src),
    parts.generateSourcemaps('eval-source-map'),
    parts.devServer({
      host,
      port,
      env
    }),
    parts.loadCSS({
      env
    })
  ]);
}
