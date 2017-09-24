module.exports = {
  // target
  entry: __dirname + "/src/index.js",

  output: {
    path: __dirname + "/dist",
    publicPath: "/dist/",
    filename: "bundle.js"
  },

  module: {
    // compiler
    loaders: [
      {
        test: /\.js$/,
        loader: "babel-loader"
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          {
            loader: "css-loader",
            options: {
              modules: true, // default is false
              sourceMap: true,
              importLoaders: 1,
              localIdentName: "[name]--[local]--[hash:base64:8]"
            }
          },
          "postcss-loader"
        ]
      }
    ]
  }
};
