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
        domains: ['firebasestorage.googleapis.com', 'images.unsplash.com', 'plus.unsplash.com', 'via.placeholder.com', 'placehold.co'],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '**',
            },
        ],
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
                    { key: 'Retry-After', value: '60' },
                    { key: 'X-RateLimit-Limit', value: '100' },
                    { key: 'X-RateLimit-Remaining', value: '100' },
                    { key: 'X-RateLimit-Reset', value: '60' },
                ]
            },
            {
                source: '/:path*',
                headers: [
                    // CORS Headers
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
                    { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization' },
                    { key: 'Access-Control-Expose-Headers', value: 'Content-Length, X-Content-Range' },
                    { key: 'Access-Control-Max-Age', value: '86400' },

                    // Security Headers
                    { key: 'X-Frame-Options', value: 'DENY' },
                    { key: 'X-Content-Type-Options', value: 'nosniff' },
                    { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
                    { key: 'X-XSS-Protection', value: '1; mode=block' },
                    { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
                    {
                        key: 'Content-Security-Policy',
                        value: `
                            default-src 'self';
                            script-src 'self' 'unsafe-eval' 'unsafe-inline';
                            style-src 'self' 'unsafe-inline';
                            img-src 'self' data: https://*.unsplash.com https://firebasestorage.googleapis.com https://via.placeholder.com https://www.google.com https://placehold.co;
                            font-src 'self';
                            connect-src 'self' https://*.googleapis.com https://*.firebaseio.com https://firestore.googleapis.com https://identitytoolkit.googleapis.com;
                            frame-src 'self' https://*.firebaseapp.com;
                            media-src 'self';
                            object-src 'none';
                        `.replace(/\s+/g, ' ').trim()
                    },
                    { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()' },
                    { key: 'X-DNS-Prefetch-Control', value: 'on' },
                    { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
                    { key: 'X-Download-Options', value: 'noopen' },
                    { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive, nosnippet, noimageindex' },
                    { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
                    { key: 'Pragma', value: 'no-cache' },
                    { key: 'Expires', value: '0' },
                    { key: 'X-Request-ID', value: '${requestId}' },
                    { key: 'X-Response-Time', value: '${responseTime}' },
                ]
            }
        ]
    }
}

module.exports = nextConfig 