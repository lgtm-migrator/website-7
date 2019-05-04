"use strict";

const webpack = require("webpack");
const path = require("path");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");

const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const HtmlWebpackInlineSourcePlugin = require("html-webpack-inline-source-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyJSPlugin = require("uglifyjs-webpack-plugin");

module.exports = {

	mode: "production",

	entry: {
		main: "./src/static/ts/main.ts"
	},

	output: {
		path: path.resolve(process.cwd(), "deploy"),
		publicPath: "/",
		filename: "static/js/[name].js"
	},

	devtool: false,

	resolve: {
		extensions: [".ts", ".js", ".scss"]
	},

	module: {
		rules: [{
			test: /\.ts$/,
			loader: "ts-loader"
		}, {
			test: /\.scss$/,
			use: [{
				loader: MiniCssExtractPlugin.loader
			}, {
				loader: "css-loader",
				options: {
					importLoaders: 1
				}
			}, {
				loader: "postcss-loader",
				options: {
					ident: "postcss",
					plugins: [
						autoprefixer(),
						cssnano({
							safe: true,
							autoprefixer: false,
							discardComments: {
								removeAll: true
							}
						})
					]
				}
			}, {
				loader: "sass-loader"
			}]
		}, {
			test: /\.(eot|otf|ttf|woff|woff2)$/,
			loader: "file-loader?publicPath=/static/fonts/&outputPath=static/fonts/&name=[name].[ext]"
		}, {
			test: /\.(jpg|png|webp|gif|svg|ico)$/,
			include: path.resolve(process.cwd(), "src/static/gfx"),
			loader: "file-loader?publicPath=/static/gfx/&outputPath=static/gfx/&name=[name].[ext]"
		}, {
			test: /\.(jpg|png|webp)$/,
			include: path.resolve(process.cwd(), "src/static/images"),
			loader: "file-loader?publicPath=/static/images/&outputPath=static/images/&name=[name].[ext]"
		}, {
			test: /\.hbs$/,
			loader: "handlebars-loader"
		}]
	},

	plugins: [
		new webpack.EnvironmentPlugin({
			NODE_ENV: "production",
			DEBUG: false
		}),

		new CopyWebpackPlugin([
			{from: "src/robots.txt", to: "."},
			{from: "src/sitemap.xml", to: "."},
			{from: "src/static/images/*.jpg", to: "static/images/", flatten: true},
			{from: "src/static/images/*.webp", to: "static/images/", flatten: true},
			{from: "src/static/videos/*.mp4", to: "static/videos/", flatten: true},
			{from: "src/static/gfx/*.jpg", to: "static/gfx/", flatten: true},
			{from: "src/static/gfx/*.webp", to: "static/gfx/", flatten: true},
			{from: "src/static/gfx/*.png", to: "static/gfx/", flatten: true},
			{from: "src/static/gfx/*.svg", to: "static/gfx/", flatten: true}
		]),

		new MiniCssExtractPlugin({
			filename: "static/css/[name].css"
		}),

		new HtmlWebpackPlugin({
			template: "src/index.hbs",
			filename: "index.html",
            favicon: "src/static/gfx/favicon.ico",
			hash: false,
			inject: true,
			compile: true,
			cache: true,
			showErrors: true,
			minify: {
				html5: true,
				caseSensitive: true,
				collapseWhitespace: true,
				removeComments: true,
				removeScriptTypeAttributes: true,
				removeStyleLinkTypeAttributes: true,
				processScripts: ["application/ld+json"],
				lint: false,
				minifyJS: true,
				minifyCSS: true
			},
			inlineSource: ".(js|css)$",
			chunksSortMode: "manual",
			chunks: ["main"]
		}),

		new HtmlWebpackInlineSourcePlugin()
	],

	optimization: {
		minimizer: [
			new UglifyJSPlugin({
				parallel: true, // !important to speedup the build process
				cache: true,
				uglifyOptions: {
					mangle: true,
					output: {
						comments: false
					},
					compress: {
						booleans: true,
						comparisons: true,
						conditionals: true,
						dead_code: true,
						drop_console: true,
						drop_debugger: true,
						evaluate: true,
						if_return: true,
						inline: true,
						join_vars: true,
						loops: true,
						properties: true,
						sequences: true,
						unused: true,
						warnings: false
					}
				}
			})
		]
	},

	performance: {
		hints: false
	},

	watchOptions: {
		ignored: /node_modules|deploy/
	}
};