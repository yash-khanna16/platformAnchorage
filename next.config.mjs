// next.config.mjs
import url from 'url-loader';

const nextConfig = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.ttf$/,
      use: {
        loader: 'url-loader',
        options: {
          limit: 100000, // Adjust the limit as needed
          name: '[name].[ext]',
          outputPath: 'static/fonts/',
        },
      },
    });

    return config;
  },
};

export default nextConfig;
