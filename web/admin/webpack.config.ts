import  webpack from "webpack";
import  HtmlWebPackPlugin from "html-webpack-plugin";
let  path = require("path");
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const htmlPlugin = new HtmlWebPackPlugin({
  template: "./public/index.html"
});

const isDevelopment = process.argv[process.argv.indexOf('--mode') + 1] === 'development';
const watchOpt = process.argv[process.argv.indexOf('--watch')];

let plugins = [ htmlPlugin ]

if(watchOpt) {
  plugins = [...plugins, new ForkTsCheckerWebpackPlugin()]
}

const config: webpack.Configuration = {
  entry: "./src/index.tsx",

  output: {
    publicPath: '/',
    //filename: 'main.es.js',
    chunkFilename: '[id].js',
    library: {
      name: 'webui',
      type: 'umd',
      umdNamedDefine: true
    },
  },

  optimization: {
    minimize: !isDevelopment,
    runtimeChunk: true
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [path.resolve(__dirname, 'src'), 'node_modules']
  },

  watchOptions: {
    aggregateTimeout: 200,
    poll: 1000,
  },

  devtool: false, //generate source map control

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: { 
          //disable type checker - we will use it in fork plugin, Use ForkTsCheckerWebpackPlugin
          //to run in the background
          transpileOnly: watchOpt ? true : false
        },
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s(a|c)ss$/,
        exclude: /\.module.(s(a|c)ss)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader', options: { sourceMap: isDevelopment } }
        ]
      }
    ],
  },

  //@ts-ignore
  plugins: plugins,
   //@ts-ignore
  devServer: {
    static: path.join(__dirname, "build"),
    historyApiFallback: true,
    port: 3000,
    open: true,
    hot: true,
  //   proxy: {
  //     '/rest/v1.0.0': {
  //          target: 'http://localhost:3000',
  //          router: () => 'http://localhost:7080',
  //          logLevel: 'debug' /*optional*/
  //     }
  //  }
  },
};

export default config;
