const path = require("path"),
    webpack = require("webpack"),
    MiniCssExtractPlugin = require("mini-css-extract-plugin"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    ScriptExtHtmlWebpackPlugin = require("script-ext-html-webpack-plugin"),
    ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");

const ROOT_DIR = __dirname;
const SOURCE_PATH = path.join(ROOT_DIR, 'src');
const DISTRIBUTION_PATH = path.join(ROOT_DIR, 'dist');

module.exports = (env = {}) => {
    const NODE_ENV = process.env.NODE_ENV || "development";
    const isProd = NODE_ENV === "production";

    return {
        mode: NODE_ENV,
        devtool: isProd ? 'source-map' : 'cheap-module-source-map',
        context: ROOT_DIR,
        resolve: {
            extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
            alias: {
                'react-dom': '@hot-loader/react-dom',
                '@app': path.resolve(SOURCE_PATH),
            },
        },
        entry: {
            app: [SOURCE_PATH + '/app.tsx']
        },
        output: {
            path: DISTRIBUTION_PATH,
            filename: isProd ? '[name].[chunkhash].js' : '[name].js',
            publicPath: '/',
            chunkFilename: '[name].[id].[chunkhash].js',
        },
        module: {
            rules: [
                // typescript
                {
                    test: /\.(tsx?)?$/,
                    include: SOURCE_PATH,
                    use: {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            babelrc: false,
                            presets: [
                                [
                                    "@babel/env",
                                    {targets: {browsers: "last 2 versions"}}
                                ],
                                "@babel/typescript",
                                "@babel/react"
                            ],
                            plugins: [
                                ["@babel/plugin-proposal-object-rest-spread"],
                                ["@babel/plugin-transform-destructuring"],
                                ["@babel/plugin-proposal-decorators", {legacy: true}],
                                ["@babel/plugin-proposal-class-properties", {loose: true}],
                                "react-hot-loader/babel"
                            ]
                        }
                    },
                },

                //css,scss,sass
                {
                    test: /\.(sa|sc|c)ss$/,
                    use: [
                        isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },

                // images
                {
                    test: /\.(jpg|jpeg|png|gif|svg)$/,
                    use: [
                        {loader: 'file-loader?hash=sha512&digest=hex&name=[hash].[ext]'}
                    ],
                },

                // fonts
                {
                    test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    use: [
                        {loader: 'url-loader?limit=10000&mimetype=application/font-woff'}
                    ]
                },
                {
                    test: /\.(ttf|eot|otf)$/,
                    use: {
                        loader: 'file-loader'
                    },
                }
            ],
        },

        plugins: [
            new webpack.EnvironmentPlugin({
                NODE_ENV
            }),
            new HtmlWebpackPlugin({
                filename: 'index.html',
                template: SOURCE_PATH + '/index.ejs',
                inject: true,
                minify: {},
                hash: true,
                showErrors: true,
                xhtml: true,
                data: {
                    base_url: "/",
                    BUILD_BRANCH: process.env.BUILD_BRANCH || "",
                    BUILD_COMMIT: process.env.BUILD_COMMIT || ""
                }
            }),
            new ScriptExtHtmlWebpackPlugin({
                defaultAttribute: "defer"
            }),
            new MiniCssExtractPlugin({
                filename: isProd ? "[name].[hash].css" : "[name].css",
                chunkFilename: isProd ? "[id].[hash].css" : "[id].css"
            }),
            ...(isProd ? [] : [
                new webpack.HotModuleReplacementPlugin({
                    // multiStep: true, // better performance with many files
                }),
                new ForkTsCheckerWebpackPlugin()
            ]),
            ...(isProd ? [
                new webpack.LoaderOptionsPlugin({
                    minimize: true,
                    debug: false
                })
            ] : [])
        ],

        optimization: {
            splitChunks: {
                cacheGroups: {
                    commons: {
                        chunks: 'initial',
                        minChunks: 2
                    },
                    vendors: {
                        test: /[\\/]node_modules[\\/]/,
                        filename: isProd ? 'vendor.[hash].js' : 'vendor.js',
                        chunks: 'all',
                        priority: -10
                    }
                }
            },
            runtimeChunk: true
        },

        devServer: isProd ? undefined : {
            hot: true,
            hotOnly: true,
            historyApiFallback: true,
            overlay: true,
            compress: true,
            noInfo: true,
            stats: 'errors-only',
            inline: true
        }
    };

};
