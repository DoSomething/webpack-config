# webpack-config

This is our shared [Webpack](http://webpack.github.io) config used for front-end projects at DoSomething.org. It builds JavaScript with [Babel](https://babeljs.io), SCSS with [LibSass](http://sass-lang.com/libsass), and CSS with [Autoprefixer](https://github.com/postcss/autoprefixer) and [CSS-MQPacker](https://github.com/hail2u/node-css-mqpacker). It is also configured to hash static asset filenames, or bundle as Data URIs if small enough.

### Getting Started

```js
var webpack = require('webpack');
var config = require('@dosomething/webpack-config');

module.exports = config({
  entry: {
    'main': './src/index.js'
  }
});
```

### License
&copy;2016 DoSomething.org. @dosomething/webpack-config is free software, and may be redistributed under the
terms specified in the [LICENSE](https://github.com/DoSomething/webpack-config/blob/master/LICENSE) file. The
name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.
