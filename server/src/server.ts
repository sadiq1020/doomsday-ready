import { app } from "./app.js";
import { env } from "./config/env.js";

// Start Express server on 0.0.0.0 for container and cloud platform compatibility
const HOST = "0.0.0.0";
const server = app.listen(env.PORT, HOST, () => {
  console.log(`🚀 Server listening on ${HOST}:${env.PORT} in ${env.NODE_ENV} mode`);
  console.log(`🩺 Health check available at: http://localhost:${env.PORT}/api/health`);
});

// Graceful shutdown listeners
process.on("SIGTERM", () => {
  console.log("👋 SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("💥 HTTP server closed");
  });
});

process.on("SIGINT", () => {
  console.log("👋 SIGINT signal received: closing HTTP server");
  server.close(() => {
    console.log("💥 HTTP server closed");
  });
});

