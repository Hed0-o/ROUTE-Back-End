import express from "express";
import dbConnectionStatus from "./DB/connectionDB.js";
import userRouter from "././modules/user/user.controller.js";
import noteRouter from "././modules/note/note.controller.js";
import errorHandler from "./common/middlewares/errorHandler.js";
import { redisConnectionStatus } from "./DB/connectionRedisDB.js";
import { checkEmailConnection } from "./common/services/nodemailer.js";

const port = 3000;
const app = express();

const bootstrap = async () => {
  app.use(express.json());
  dbConnectionStatus();
  redisConnectionStatus();
  checkEmailConnection();

  app.get("/", (req, res) => {
    return res.status(200).json({ message: "Welcome!" });
  });

  app.use("/user", userRouter);
  app.use("/note", noteRouter);
  app.use("", errorHandler);

  app.use("/{*demo}", (req, res) => {
    return res
      .status(404)
      .json({ message: `${req.method} ${req.baseUrl} is not found.` });
  });
  app.listen(port, () => {
    console.log(`Server is running in port ${port}.`);
  });
};

export default bootstrap;
