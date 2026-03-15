import path from "path";

export default {
  server: {
    host: "::",
    port: 8080,
    proxy: {
      "/api/sandbox": {
        target: "http://localhost:8787",
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
    },
  },
};