const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const merge = require('webpack-merge');

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
const config = {
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
            { test: /\.css$/, use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss]) },

            // Bundle SCSS stylesheets (processed with LibSass & PostCSS), extract to single CSS file per bundle.
            { test: /\.scss$/, use: ExtractTextPlugin.extract(['css-loader?sourceMap', postcss, 'sass-loader?sourceMap']) }
        ]
    },
    plugins: [
        // Make NODE_ENV accessible from within client scripts (for conditional dev/prod builds).
        new webpack.EnvironmentPlugin(['NODE_ENV']),

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
    ],

    stats: {
        // Don't print noisy output for extracted CSS children.
        children: false,
    },
};


// Production build settings:
const production = {
  plugins: [
      // Minify produciton builds & remove logging.
      new webpack.optimize.UglifyJsPlugin({
          compress: {
              warnings: false,
              drop_console: true,
              drop_debugger: true,
              dead_code: true,
          }
      }),
  ],
};

// Development build settings:
const development = {
    // Enable source maps when in development.
    // @see: https://git.io/vSAY0
    devtool: '#cheap-module-source-map',
};

// Export a `configure()` function for applications to
// import & extend in their `webpack.config.js` files.
module.exports = function(options) {
    const isProductionBuild = process.env.NODE_ENV === 'production';
    const environmentConfig = isProductionBuild ? production : development;

    return merge(config, environmentConfig, options);
};

