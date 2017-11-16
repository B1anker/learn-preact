import webpack from 'webpack'
import path from 'path'
const debug = process.env.NODE_ENV !== 'production'

const resolve = (dir) => {
	return path.join(__dirname, dir)
}

export default {
	context: path.join(__dirname),
	devtool: debug ? 'inline-sourcemap' : null,
	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
		alias: {
			'@': resolve('src')
		}
	},
	entry: [
		'../src/entry.tsx'
	],
	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				loader: 'tslint-loader',
				enforce: 'pre',
				exclude: /(node_modules)/
			},
			{
				test: /\.tsx?$/,
				loader: 'awesome-typescript-loader',
				exclude: /(node_modules)/
			},
			{
				test: /\.css$/,
				loader: 'style-loader!css-loader?modules'
			},
			{
				test: /\.less/,
				loader: 'style-loader!typings-for-css-modules-loader?modules&less'
			}
		]
	},
	output: {
		path: __dirname + '/src',
		publicPath: '/src/',
		filename: "bundle.js"
	},
	plugins: debug ? [] : [
		new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false })
	]
}