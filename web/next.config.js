/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
    '@mui/x-data-grid',
    'react-reader',
    'epubjs'
])

module.exports = withTM({
    trailingSlash: true,
    reactStrictMode: false,
    experimental: {
        esmExternals: false,
        jsconfigPaths: true // enables it for both jsconfig.json and tsconfig.json
    },
    rewrites: () => [
        {
            source: '/api/:path*',
            destination: 'http://localhost:3001/api/:path*'
        }
    ]
    ,
    webpack: config => {
        config.resolve.alias = {
            ...config.resolve.alias
        }

        return config
    }
})
