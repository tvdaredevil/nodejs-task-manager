import "reflect-metadata";
import cookieParser from "cookie-parser";
import express from "express";
import { AuthController } from "./controllers/AuthenticationController";
import apiRouter from "./routes/api";

import { appDataSource } from "./dataSource";
import { STATIC_DIR } from "./constants";

const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/signup", AuthController.signup);
app.post("/login", AuthController.login);
app.get("/logout", AuthController.logout);
app.get("/login", (_, res) => {
  res.sendFile("login.html", { root: STATIC_DIR });
});
app.get("/signup", (_, res) => {
  res.sendFile("signup.html", { root: STATIC_DIR });
});

app.use(AuthController.authenticateRequest);
app.use(express.static(STATIC_DIR));

app.use("/api", apiRouter);

// Default to serving index.html if no routes match
app.use("*", (req, res) => {
  res.sendFile("index.html", { root: STATIC_DIR });
});

appDataSource
  .initialize()
  .then(() => {
    console.log("sqlite ORM data source initialized");
    app.listen(3000, () => {
      console.log("Server started on http://localhost:3000");
    });
  })
  .catch((err) => {
    console.error(`Error initializing sql lite ORM data source ${err}`);
  });
