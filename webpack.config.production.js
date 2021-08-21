const HtmlWebPackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');


module.exports = {
    mode: "production",
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
        filename : "./index.html" }),

      new webpack.DefinePlugin({
        "process.env.CLIENT_MODE": JSON.stringify("production")
      })
    ],

};
