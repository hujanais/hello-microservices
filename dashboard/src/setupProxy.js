const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api/users",
    createProxyMiddleware({
      target: "http://192.168.1.69:5500",
      changeOrigin: true,
    })
  );
  app.use(
    "/api/product",
    createProxyMiddleware({
      target: "http://192.168.1.69:5501",
      changeOrigin: true,
    })
  );
};
