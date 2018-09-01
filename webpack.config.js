var path = require('path');
const NodemonPlugin = require( 'nodemon-webpack-plugin' )
const nodeExternals = require('webpack-node-externals')
var pathToPhaser = path.join(__dirname, '/node_modules/phaser/');
var phaser = path.join(pathToPhaser, 'dist/phaser.js');

module.exports = [
    {
        mode: "development",
        devtool: "inline-source-map",
        entry: "./src/server/index.ts",
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
        entry: "./src/client/index.ts",
        output: {
            filename: "./client/js/bundle.js"
        },
        resolve: {
            // Add `.ts` and `.tsx` as a resolvable extension.
            extensions: [".ts", ".tsx", ".js", '.json'],
            alias: {
                phaser: phaser
            }
        },
        module: {
            rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: "ts-loader" },
            { test: /phaser\.js$/, loader: 'expose-loader?Phaser' },
            {test: /\.json$/, loader: "json"}
            ]
        },
    }
]