/**
 * 公共配置
 */




module.exports = {
    // 加载器
    module: {
        // https://doc.webpack-china.org/guides/migrating/#module-loaders-module-rules
        rules: [

            {
                test: /\.js$/,
                loader: 'babel-loader', exclude: /node_modules/
            },

        ]
    },

};
