module.exports = {
    // エントリポイント
    entry: __dirname + "/src/index.js",

    // 出力先の設定
    output: {
        path: __dirname + "/dist",
        filename: "budle.js"
    },

    // jsx に babel さんつかってくださいねーって。。。
    module: {
        loaders: [
            {test: /\.jsx$/, loader: "babel"}
        ]
    }
};
