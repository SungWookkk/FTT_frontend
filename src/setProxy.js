const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
    // STOMP/SockJS endpoint 전체
    app.use(
        '/ws/**',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            ws: true,
            changeOrigin: true,
            logLevel: 'debug',      // (선택) 디버그 로깅 켜서 어떤 요청이 프록시되는지 보실 수 있습니다.
        })
    );

    // 2) 기존 API 프록시
    app.use(
        '/',
        createProxyMiddleware({
            target: 'http://localhost:8080',
            changeOrigin: true,
        })
    );
};