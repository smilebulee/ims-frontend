const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/local',
    createProxyMiddleware({
      target: 'http://localhost:8080',
      changeOrigin: true,
    })
  );
  app.use(
    '/ims',
    createProxyMiddleware({
      target: 'http://112.220.26.195:8080',
      changeOrigin: true,
    })
  );
};
