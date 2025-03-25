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
    },
    images: {
        domains: ['firebasestorage.googleapis.com'],
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Credentials', value: 'true' },
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,DELETE,PATCH,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
                ]
            },
            {
                source: '/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
                    { key: 'Access-Control-Expose-Headers', value: 'Content-Length, X-Content-Range' },
                    { key: 'Access-Control-Max-Age', value: '86400' }
                ]
            }
        ]
    }
}

module.exports = nextConfig 