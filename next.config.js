/** @type {import('next').NextConfig} */
const nextConfig = {
    transpilePackages: ['@firebase/storage', 'firebase', 'undici'],
    webpack: (config, { isServer }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                fs: false,
                net: false,
                tls: false,
                crypto: false,
                stream: false,
                path: false,
                zlib: false,
                http: false,
                https: false,
                buffer: false,
                util: false,
                url: false,
                assert: false,
                os: false,
                process: false,
            };
        }

        // Add rule for handling private class fields in undici
        config.module.rules.push({
            test: /[\\/]node_modules[\\/]undici[\\/].*\.js$/,
            loader: 'babel-loader',
            options: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-private-methods', '@babel/plugin-proposal-class-properties']
            }
        });

        return config;
    }
}

module.exports = nextConfig 