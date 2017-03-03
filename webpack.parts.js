const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const PurifyCSSPlugin = require('purifycss-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const postCSSConfig = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: function() {
      return [
        require('autoprefixer'),
        require('precss')
      ];
    }
  }
};

exports.devServer = function(options) {
  return {
    devServer: {
      contentBase: path.resolve(__dirname, './src'),
      historyApiFallback: true,
      hot: true,
      hotOnly: true,
      host: options.host,
      port: parseInt(options.port),
      compress: options.env.prod,
      stats: {colors: true}
    },
    devtool: 'source-map',
    plugins: [
      new webpack.HotModuleReplacementPlugin({
        // multiStep: true
      }),
      new webpack.NamedModulesPlugin()
    ]
  }
};

exports.loadCSS = function(options) {
  return {
    module: {
      rules: [
        {
          test: /\.(sass|scss)$/,
          use: ['style-loader', 'css-loader', postCSSConfig, 'sass-loader']
        },
        {
          test: /\.less$/,
          use: ['style-loader', 'css-loader', postCSSConfig, 'less-loader']
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', postCSSConfig]
        }
      ]
    }
  }
};

exports.extractCSS = function(options) {
  return {
    module: {
      rules: [
        {
          test: /\.(sass|scss)$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              postCSSConfig,
              'sass-loader'
            ]
          })
        },
        {
          test: /\.less$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              postCSSConfig,
              'less-loader'
            ]
          })
        },
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              'css-loader',
              postCSSConfig
            ]
          })
        }
      ]
    },
    plugins: [
      new ExtractTextPlugin('[name].[contenthash].css')
    ]
  }
};

exports.purifyCSS = function(options) {
  options.paths = Array.isArray(options.paths) ? options.paths : [options.paths];
  return {
    plugins: [
      new PurifyCSSPlugin({
        basePath: '/',
        paths: options.paths.map(path => `${path}/**/*`),
        resolveExtensions: ['.html'],
        purifyOptions: {
          min: true,
          info: true
        }
      })
    ]
  };
};

exports.generateSourcemaps = function(type) {
  return {
    devtool: type
  };
};

exports.extractBundles = function(bundles, options) {
  const entry = {};
  const names = [];

  bundles.forEach(({ name, entries }) => {
    if (entries) {
      entry[name] = entries;
    }
    names.push(name);
  });

  return {
    entry,
    plugins: [
      new webpack.optimize.CommonsChunkPlugin(
        Object.assign({}, options, { names })
      )
    ]
  };
};

exports.loadJavaScript = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.js$/,
          include: paths,
          use: [
            {
              loader: 'babel-loader',
              options: {
                cacheDirectory: true
              }
            }
          ]
        }
      ]
    }
  }
};

exports.clean = function(path) {
  return {
    plugins: [
      new CleanWebpackPlugin([path])
    ]
  };
};

exports.minifyJavaScript = function({ useSourceMap }) {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          'screw_ie8': true,
          'unused': true,
          'dead_code': true,
          'conditionals': true,
          'comparisons': true,
          'sequences': true,
          'evaluate': true,
          'if_return': true,
          'join_vars': true,
          'warnings': false
        },
        output: {
          comments: false
        },
        mangle: {
          except: ['webpackJsonp'] // avoid mangling webpack runtime
        },
        sourceMap: useSourceMap
      })
    ]
  };
};

exports.setFreeVariable = function(key, value) {
  const env = {};
  env[key] = JSON.stringify(value);

  return {
    plugins: [
      new webpack.DefinePlugin(env)
    ]
  };
};

exports.compress = function() {
  return {
    plugins: [
      new CompressionPlugin({
        asset: '[path].gz[query]',
        algorithm: 'gzip',
        test: /\.js$|\.html$/,
        threshold: 10240,
        minRatio: 0.8
      })
    ]
  };
};

exports.dontParse = function(options) {
  console.log(options.path);
  const alias = {};
  alias[options.name] = options.path;

  return {
    module: {
      noParse: [
        /\.min\.js/
      ]
    },
    resolve: {
      alias: alias
    }
  };
};

exports.loadFiles = function() {
  return {
    module: {
      rules: [
        {
          test: /\.(gif|png|jpg|jpeg|ttf|eot|svg|woff(2)?)$/,
          use: 'file-loader'
        }
      ]
    }
  }
};

exports.loadJavascript30 = function(fromPath, toPath) {
  console.log(path.join(fromPath, 'javascript30/**/*.html'));
  console.log(path.join(toPath, 'javascript30'));
  return {
    plugins: [
      new CopyWebpackPlugin([
        { from: path.join(fromPath, 'javascript30'), to: path.join(toPath, 'javascript30') }
      ])
    ]
  };
};
