// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './index.js', // 진입점(entry point) 설정
    output: {
        filename: 'bundle.js', // 빌드된 파일 이름
        path: path.resolve(__dirname, 'dist'), // 빌드 결과물이 저장될 경로
    },
    resolve: {
        alias: {
            "@audio": path.resolve(__dirname, "audio"),
            "@image": path.resolve(__dirname, "img"),
            "@": path.resolve(__dirname, "src"),
            "@domain": path.resolve(__dirname, "src/domain"),
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/, // .js 확장자를 가진 모든 파일
                exclude: /node_modules/, // node_modules 폴더 제외
                use: {
                    loader: 'babel-loader', // Babel 로더 사용
                    options: {
                        presets: ['@babel/preset-env'], // Babel의 preset 설정
                    },
                },
            },
            {
                test: /\.(mp3|wav|ogg)$/, // 사용하려는 오디오 파일의 확장자를 추가
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]', // 번들링된 파일의 이름을 원본 파일 이름과 동일하게 유지
                            outputPath: 'assets/audio/', // 번들링된 파일이 저장될 경로 (dist 폴더 기준)
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'images/[name].[ext]',
                        },
                    },
                ],
            },
        ],
    },
    watch: true,
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
        }),
    ],
};
