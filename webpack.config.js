var webpack=require('webpack');
module.exports={
	entry:{
        bundle:__dirname+"/main.js"
    },
	output:{
		path:__dirname+"/build",
		filename:"app.js"

	},
	module:{
        loaders:[{
            test:/\.js$/,
            exclude:/node_modules/,
            loader:"babel-loader",
            query:{
                presets:["es2015","stage-2","react"]
            }
        },
        {
            test:/\.css$/, 
            loader:"style-loader!css-loader"//多个加载器通过字符串的形式以!分离
        }]
    },
    plugins:[
        // new webpack.optimize.CommonsChunkPlugin({
        //     name:'vendor',
        //     filename:'vendor.js'
        // }),
        // new webpack.DefinePlugin({
        //     'process.env.NODE_ENV': '"production"'
        // }),
        new webpack.optimize.UglifyJsPlugin({
            compress:{
                warnings: false
            }
        })
    ]
}