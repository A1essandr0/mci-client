const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    entry : "./src/code/main.tsx",
    resolve : { extensions : [ ".ts", ".tsx", ".js" ] },
    module : {
      rules : [
        { test : /\.html$/, use : { loader : "html-loader" } },
        { test : /\.css$/,
          use : [ "style-loader", "css-loader"] },
        { test : /\.tsx?$/, use: 'ts-loader',
          exclude: '/node/modules' }
      ]
    },
    
    plugins : [
      new HtmlWebPackPlugin({ template : "./src/index.html",
        filename : "./index.html" })
    ],

    devServer: {
        contentBase: "./dist",
        port: 4500
    },

    // performance : { hints : false },
    devtool : "source-map"
};
