import express from "express";
import * as config from "../config/config.service.js";
import helmet from "helmet";
import cors from "cors";
import dbConnectionStatus from "./DB/connectionDB.js";
import { redisConnectionStatus } from "./DB/connectionRedisDB.js";
import { checkEmailConnection } from "./common/services/nodemailer.js";
import userRouter from "./modules/user/user.controller.js";
import noteRouter from "./modules/note/note.controller.js";
import errorHandler from "./common/middlewares/errorHandler.js";

const port = config.PORT;
const app = express();

const bootstrap = async () => {
  // Hide "X-Powered-By: Express"
  app.disable("x-powered-by");

  app.use(helmet());

  app.use(express.json());

  app.use(
    cors({
      origin: ["https://mydomain.com"],
    }),
  );

  // app.use((req, res, next) => {
  //   const allowedOrigins = ["https://mydomain.com"];
  //   const requestOrigin = req.headers.origin;
  //   if (!requestOrigin) {
  //     return res.status(403).json({
  //       message: "Origin header is required.",
  //     });
  //   }
  //   if (!allowedOrigins.includes(requestOrigin)) {
  //     return res.status(403).json({
  //       message: "Origin not allowed.",
  //     });
  //   }
  //   next();
  // });

  dbConnectionStatus();
  redisConnectionStatus();
  checkEmailConnection();

  app.get("/", (req, res) => {
    return res.status(200).json({
      message: "Welcome!",
    });
  });

  app.use("/user", userRouter);
  app.use("/note", noteRouter);

  app.use("/{*demo}", (req, res) => {
    return res.status(404).json({
      message: `${req.method} ${req.originalUrl} is not found.`,
    });
  });

  app.use(errorHandler);

  app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
  });
};

export default bootstrap;
