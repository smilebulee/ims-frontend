const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
   '/local',
   createProxyMiddleware({
     target: 'http://localhost:8080',
     changeOrigin: true,
   })
  );
  // app.use(
  //   '/ims',
  //   createProxyMiddleware({
  //     target: process.env.REACT_APP_API_HOST,
  //     changeOrigin: true,
  //   })
  // );
};
