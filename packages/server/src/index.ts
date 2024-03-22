import express from "express";
import tsUtil from "./controllers/typescript";

const app: express.Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", tsUtil);

app.listen(5000, () => {
  console.log("Start on PORT:5000!");
});
