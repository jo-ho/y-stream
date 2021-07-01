const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {

  app.use(
    '/api',
    createProxyMiddleware( {
      target: 'http://localhost:4000',
      changeOrigin: true,
      onProxyRes: function (proxyRes, req, res) {
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        
     }
 
    })
  );
};