const NodemonPlugin = require( 'nodemon-webpack-plugin' )
const nodeExternals = require('webpack-node-externals')

module.exports = [
    {
        mode: "development",
        devtool: "inline-source-map",
        entry: "./server/index.ts",
        output: {
            filename: "./server/bundle.js"
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
            ],
        },
        externals: [nodeExternals()],
        plugins: [
            new NodemonPlugin(),
        ],
        target: 'node',
    },
    {
        mode: "development",
        devtool: "inline-source-map",
        entry: "./client/index.ts",
        output: {
            filename: "./client/js/bundle.js"
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js"]
        },
        module: {
            rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" }
            ]
        }
    }
]