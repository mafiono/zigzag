const path = require('path');
const webpack = require('webpack');


module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    },
    module: {
      rules: [
        {
          test: /\.s[ac]ss$/i,
          use: [
            // Creates `style` nodes from JS strings
            "style-loader",
            // Translates CSS into CommonJS
            "css-loader",
            // Compiles Sass to CSS
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery',
        'window.jQuery': 'jquery',
        }),
      ],
  };