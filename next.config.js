/** @type {import('next').NextConfig} */
const nextConfig = {
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
        return config;
    },
    experimental: {
        serverActions: true,
    },
}

module.exports = nextConfig 