const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://218.151.225.142:8080',
      changeOrigin: true,
    })
  );
};