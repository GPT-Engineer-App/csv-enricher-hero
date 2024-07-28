const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://api.anthropic.com',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // Remove /api prefix when forwarding the request
      },
    })
  );
};
