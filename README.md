# webpack-config

This is our shared [Webpack](http://webpack.github.io) config used for front-end projects at DoSomething.org. It builds JavaScript with [Babel](https://babeljs.io), SCSS with [LibSass](http://sass-lang.com/libsass), and CSS with [Autoprefixer](https://github.com/postcss/autoprefixer) and [CSS-MQPacker](https://github.com/hail2u/node-css-mqpacker). It is also configured to hash static asset filenames, or bundle as Data URIs if small enough.

### Getting Started
Install this package and Webpack via NPM: 

```
npm install webpack webpack-dev-server @dosomething/webpack-config --save-dev
```

Add some scripts to your `package.json`:

```js
{
  // ...
  "scripts": {
    "start": "webpack",
    "build": "NODE_ENV=production webpack",
  }
}
```

Create a `webpack.config.js` in your project directory, and set it up like so:

```js
var webpack = require('webpack');
var config = require('@dosomething/webpack-config');

module.exports = config({
  entry: {
    // Add your bundles here, so in this case
    // ./src/app.js ==> ./dist/app.js
    'app': './src/app.js'
  }
});
```

Now you can run `npm start` to build with source maps and watch for changes, and `npm run build` to build optimized assets for production! If you need to further customize your build, you can always directly modify the object returned by the `config()` function!

### License
&copy;2016 DoSomething.org. @dosomething/webpack-config is free software, and may be redistributed under the
terms specified in the [LICENSE](https://github.com/DoSomething/webpack-config/blob/master/LICENSE) file. The
name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.
