import { Server } from "http";
import app from "./app";
import config from "./config";

async function bootstrap() {
  let server: Server;

  try {
    // Start the server
    server = app.listen(config.port, () => {
      console.log(`🚀 Server is running on http://localhost:${config.port}`);
    });

    // Graceful shutdown handler
    const exitHandler = () => {
      if (server) {
        console.log("⚠️  Server shutting down...");
        server.close(() => {
          console.log("🛑 Server closed gracefully.");
          process.exit(1);
        });
      } else {
        process.exit(1);
      }
    };

    // Unexpected errors
    process.on("unhandledRejection", (reason) => {
      console.error("💥 Unhandled Rejection detected. Shutting down...");
      console.error(reason);
      exitHandler();
    });

    process.on("uncaughtException", (err) => {
      console.error("💥 Uncaught Exception detected. Shutting down...");
      console.error(err);
      exitHandler();
    });

    // OS Signals (for manual stop or Docker stop)
    process.on("SIGTERM", () => {
      console.log("📌 SIGTERM received.");
      exitHandler();
    });

    process.on("SIGINT", () => {
      console.log("📌 SIGINT (Ctrl+C) received.");
      exitHandler();
    });
  } catch (error) {
    console.error("🚨 Error during server startup:", error);
    process.exit(1);
  }
}

(async () => {
  await bootstrap();
})();
