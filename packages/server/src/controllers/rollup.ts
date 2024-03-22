import express, { Router } from "express";
import { rollup, InputOptions } from "rollup";
import virtual, { RollupVirtualOptions } from "@rollup/plugin-virtual";

const router: Router = express.Router();

const data = [
  {
    filename: "src/main.js",
    data: "import exp from 'exp';\nexp();\n",
    id: "2-js",
    type: "javascript",
  },

  {
    filename: "src/exp.js",
    data: "const exp = () => { console.log('foo'); };\nexport default exp;\n",
    id: "3-js",
    type: "javascript",
  },
] as const;

function transformData(array: typeof data) {
  const result: RollupVirtualOptions = {};
  array.forEach((item) => {
    // item.filenameから拡張子を取り除いたものをnameとする
    const name = item.filename.replace(/\..+$/, "");
    result[name] = item.data;
  });
  return result;
}

const build = async (data: RollupVirtualOptions) => {
  const inputOptions: InputOptions = {
    input: "src/main",
    plugins: [virtual(data)],
  };
  const bundle = await rollup(inputOptions);
  const out = await bundle.generate({
    file: "bundle.js",
    format: "esm",
  });
  return out.output[0].code;
};

router.post("/", async (req, res) => {
  const body = req.body;
  const out = await build(body);
  res.send(out);
});

export default router;
