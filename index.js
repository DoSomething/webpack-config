var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
var ManifestPlugin = require('webpack-manifest-plugin');
var defaults = require('lodash/defaultsDeep');
var assign = require('lodash/assign');
var path = require('path');
var fs = require('fs');

// PostCSS loader w/ options.
const postcss = {
    loader: 'postcss-loader',
    options: {
        plugins: function() {
            return [
                // Automatically add vendor prefixes using Autoprefixer.
                require('autoprefixer')({
                    browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1'],
                }),

                // Combine media queries using CSS-MQPacker.
                require('css-mqpacker')()
            ];
        }
    }

}

// Default Webpack configuration
// @see: https://webpack.js.org/configuration/
var config = {
    entry: {
        // ...
    },
    output: {
        filename: '[name]-[hash].js',
        path: 'dist',
        libraryTarget: 'umd',
    },
    module: {
        loaders: [
            // Bundle JavaScript, and transform to ES5 using Babel.
            { test: /\.js$/, exclude: /node_modules/, use: ['babel-loader'] },

            // Bundle static assets, either hashing filename or inlining into bundle if under 8KB
            { test: /\.(png|jpe?g|eot|gif|woff2?|svg|ttf)$/, use: ['url-loader?limit=8192'] },

            // Bundle CSS stylesheets and process with PostCSS, extract to single CSS file per bundle.
            { test: /\.css$/, loader: ExtractTextPlugin.extract(['css-loader', postcss]) },

            // Bundle SCSS stylesheets (processed with LibSass & PostCSS), extract to single CSS file per bundle.
            { test: /\.scss$/, loader: ExtractTextPlugin.extract(['css-loader', postcss, 'sass-loader']) }
        ]
    },
    plugins: [
        // Make NODE_ENV accessible from within client scripts (for conditional dev/prod builds).
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify(process.env.NODE_ENV)
            }
        }),

        // Extract all stylesheets referenced in each bundle into a single CSS file.
        new ExtractTextPlugin('[name]-[hash].css'),

        // Optimize ordering of modules for better minification
        new webpack.optimize.OccurrenceOrderPlugin,

        // Optimize Lodash references for smaller builds.
        new LodashModuleReplacementPlugin,

        // Create asset manifest (allowing Laravel or other apps to get hashed asset names).
        new ManifestPlugin({
          fileName: 'rev-manifest.json',
        }),
    ]
};

if(process.env.NODE_ENV === 'production') {
    // In production, minify our output with UglifyJS
    config.plugins.push(
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              dead_code: true
          }
      })
    )
} else {
    // Enable source maps when in development.
    // @see: https://git.io/vSAY0
    config.devtool = '#cheap-module-source-map';

    // Instruct Webpack to watch for changes & rebuild.
    config.watch = true;
}

var configurator = function(options) {
    return defaults(config, options);
};

module.exports = configurator;

