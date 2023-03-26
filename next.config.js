/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  // distDir: 'build',
  // assetPrefix: './',
  webpack (config) {
    config.module.rules.push(
      {
        test: /\.svg$/i,
        issuer: { and: [/\.(js|ts|md)x?$/] },
        use: [
          {
            loader: '@svgr/webpack',
            options: {
              prettier: false,
              svgo: true,
              svgoConfig: {
                plugins: [{
                  name: 'preset-default',
                  params: {
                    overrides: { removeViewBox: false }
                  },
                },
                {
                  name: 'removeAttrs',
                  params: {
                    attrs: '(fill|stroke)'
                  }
                },
                {
                  name: 'addAttributesToSVGElement',
                  params: {
                    attributes: [{ fill: 'currentColor' }]
                  }
                }]
              },
              titleProp: true
            }
          }
        ]
      },
      // {
      //   test: /\.(png|jpe?g|gif|webp|svg)$/i,
      //   type: 'asset',
      //   parser: {
      //     dataUrlCondition: {
      //       // 小于 10 kb 的图片转 base64
      //       maxSize: 10 * 1024,
      //     }
      //   }
      // },
      // {
      //   test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
      //   loader: 'url-loader',
      //   options: {
      //     limit: 10 * 1024,
      //     name: 'public/[name].[hash:8].[ext]',
      //   }
      // }
    )

    return config
  },
  async rewrites () {
    return {
      fallback: [
        { source: '/api/article/:path*', destination: 'https://summerblink.site/blog/article/:path*' }
      ]
    }
  }
}

module.exports = nextConfig

/*
      use: [
        { loader: 'svg-sprite-loader', options: {} },
        {
          loader: 'svgo-loader',
          options: {
            plugins: [
              { removeAttrs: { attrs: 'fill' } }
            ]
          }
        }
      ]
*/
