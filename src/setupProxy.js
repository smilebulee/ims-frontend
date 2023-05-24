const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://112.220.26.195:8080',
      changeOrigin: true,
    })
  );
};
