import express from "express";
import dbConnectionStatus from "./DB/connectionDB.js";
import userRouter from "./modules/user/user.controller.js";
import noteRouter from "./modules/note/note.controller.js";
import errorHandler from "./common/middlewares/errorHandler.js";

const app = express();
const port = 3000;

const bootstrap = async () => {
  app.use(express.json());

  dbConnectionStatus();

  app.get("/", (req, res) => {
    return res.status(200).json({ message: `Welcome!` });
  });

  app.use("/user", userRouter);
  app.use("/notes", noteRouter);

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
