app.use(
  "/",
  createProxyMiddleware({
    target: "https://target-website.com",
    changeOrigin: true,
    selfHandleResponse: true,
    onProxyRes: async (proxyRes, req, res) => {
      let body = "";
      proxyRes.on("data", (chunk) => {
        body += chunk;
      });
      proxyRes.on("end", () => {
        if (
          [301, 302, 303, 307, 308].includes(proxyRes.statusCode) &&
          proxyRes.headers["location"]
        ) {
          // Rewrite Location header to keep redirects inside the proxy
          const originalLocation = proxyRes.headers["location"];
          // Example: rewrite logic, replace domain in 'location'
          const proxiedLocation = originalLocation.replace(
            "https://target-website.com",
            "http://localhost:3000"
          );
          res.writeHead(proxyRes.statusCode, {
            location: proxiedLocation,
          });
          res.end();
        } else if (
          proxyRes.headers["content-type"] &&
          proxyRes.headers["content-type"].includes("text/html")
        ) {
          const modified = rewriter(body);
          res.setHeader("content-type", "text/html");
          res.end(modified);
        } else {
          res.end(body);
        }
      });
    },
  })
);
