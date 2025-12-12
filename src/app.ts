import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./app/middlewares/globalErrorHandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";
import config from "./config";

const app: Application = express();

// Trust proxy (IMPORTANT for secure cookies on Render, Railway, Fly.io, Vercel, etc.)
app.set("trust proxy", 1);

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(
//   cors({
//     origin: config.FRONTEND_URL,
//     credentials: true,
//   })
// );

// CORS for frontend (Next.js) with cookies
// app.use(
//   cors({
//     origin: config.FRONTEND_URL, // must be exact
//     credentials: true, // <— essential for cookies
//     methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
//   })
// );

app.use(
  cors({
    origin: [config.FRONTEND_URL],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use("/api", router);

app.get("/", (req: Request, res: Response) => {
  res.send({
    message: "Server is running..",
    environment: config.node_env,
    uptime: process.uptime().toFixed(2) + " sec",
    timeStamp: new Date().toISOString(),
  });
});

app.use(globalErrorHandler);

app.use(notFound);

export default app;
