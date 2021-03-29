const path = require('path')
// const webpack = require('webpack')
const HtmlWebpackPlugin =require('html-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports =  {
        entry: path.join(__dirname,'src','index.js'),
        //entry: './src/index.js',
        output: { //NEW
            path: path.join(__dirname, 'dist'),
            publicPath: '/',
            filename: 'bundle.js'
        },
        // target: 'node',
        // node: {
        //     // Need this when working with express, otherwise the build fails
        //     __dirname: false,   // if you don't put this is, __dirname
        //     __filename: false,  // and __filename return blank or /
        //   },
        //   externals: [nodeExternals()], // Need this to avoid error when working with Express
        module: {
          rules: [
            {
               test: /\.(js|jsx|css)$/,
               exclude: /node_modules/,
               use: {
                 loader: "babel-loader"
               }
            },
            {
            // Loads the javacript into html template provided.
            // Entry point is set below in HtmlWebPackPlugin in Plugins 
            test: /\.html$/,
            use: [{loader: "html-loader"}]
            },
            {
              use: ['style-loader', 'css-loader'],
              // exclude: /node_modules/,
              test: /\.css$/
            }
          ]
        },
        resolve: {
          extensions: ['*', '.js', '.jsx']
        },
        plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html',
            filename: "./index.html"
        })
        ],
        devServer: {
          contentBase: './dist',
          hot: true,
          historyApiFallback: true
        }
}