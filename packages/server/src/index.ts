import express from "express";
import fs from "./controllers/fs";
import rollup from "./controllers/rollup";

const app: express.Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", fs);
app.use("/rollup", rollup);

app.listen(5000, () => {
  console.log("Start on PORT:5000!");
});
