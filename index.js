/**
 * This is DoSomething.org's shared Webpack config for
 * building JavaScript, SCSS, and other front-end assets.
 */

var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var defaults = require('lodash/defaultsDeep');
var assign = require('lodash/assign');
var path = require('path');
var fs = require('fs');

var config = {
    entry: {
      // ...  
    },
    output: {
        filename: '[name].js',
        path: 'dist',
        libraryTarget: 'umd',
    },
    externals: {
        // Don't bundle the 'jquery' package with the library (forge.js), but
        // instead load from `jQuery` global variable or AMD/CJS package.
        'jquery': {
            root: 'jQuery',
            commonjs2: 'jquery',
            amd: 'jquery'
        }
    },
    module: {
        loaders: [
            // Bundle JavaScript, and transform to ES5 using Babel.
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },

            // Bundle static assets, either hashing filename or inlining into bundle if under 8KB
            { test: /\.(png|jpg|eot|gif|woff|svg|ttf)$/, loader: 'url?limit=8192' },

            // Bundle CSS stylesheets and process with PostCSS, extract to single CSS file per bundle.
            { test: /\.css$/, loader: ExtractTextPlugin.extract('css?sourceMap!postcss') },

            // Bundle SCSS stylesheets (processed with LibSass & PostCSS), extract to single CSS file per bundle.
            { test: /\.scss$/, loader: ExtractTextPlugin.extract('css?sourceMap!postcss!sass?sourceMap') }
        ]
    },
    postcss: function() {
        return [
            // Automatically add vendor prefixes using Autoprefixer.
            require('autoprefixer')({
                browsers: ['last 4 versions', 'Firefox ESR', 'Opera 12.1'],
            }),

            // Combine media queries using CSS-MQPacker.
            require('css-mqpacker')()
        ];
    },
    plugins: [
        // Make NODE_ENV accessible from within client scripts (for conditional dev/prod builds).
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': process.env.NODE_ENV
            }
        }),

        // Extract all stylesheets referenced in each bundle into a single CSS file.
        new ExtractTextPlugin('[name].css'),
        // ...
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
    // Enable inline source maps when in development.
    config.devtool = '#inline-source-map';

    // Instruct Webpack to watch for changes & rebuild.
    config.watch = true;
}

var configurator = function(options) {
    var c = defaults(config, options);

    // If we're running in NPM 2.x, we need to tell Webpack to check
    // this package's `node_modules` when resolving loaders
    var packageModules = path.join(__dirname, 'node_modules');
    if (fs.existsSync(packageModules)) {
        assign(config, { resolveLoader: { modulesDirectories: [packageModules] } });
    }
    
    return c;
};

module.exports = configurator;

