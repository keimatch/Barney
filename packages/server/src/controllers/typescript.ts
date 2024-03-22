import express, { Router } from "express";
import fs from "fs";
import path from "path";
import ts from "typescript";

const router: Router = express.Router();

const saveDir = path.resolve(__dirname, "../output");

const createFile = (data: string, filename: string) => {
  const filePath = path.join(saveDir, filename);
  fs.writeFile(filePath, data, (err) => {
    // ディレクトリ作成できなかったとき
    if (err && err.code === "ENOENT") {
      // ディレクトリ部分だけ切り取り
      const dir = filePath.substring(0, filePath.lastIndexOf("/"));

      // 親ディレクトリ作成
      fs.mkdir(dir, { recursive: true }, (err) => {
        if (err) throw err;
        createFile(data, filename);
      });
      return;
    }
  });
};

type File = {
  filename: string;
  data: string;
};

const createFiles = (files: File[]) => {
  files.forEach((file) => {
    createFile(file.data, file.filename);
  });
};

const removeDir = () => {
  fs.rm(saveDir, { recursive: true }, () => {
    // console.log("削除が完了しました");
  });
};

const createProgram = async (files: File[]) => {
  const fileNames = files.map((file) => {
    return path.join(saveDir, file.filename);
  });

  const options: ts.CompilerOptions = {
    declaration: true,
    emitDeclarationOnly: true,
    noEmitOnError: true,
    allowImportingTsExtensions: true,
  };

  const output: { fileName: string; content: string }[] = [];

  const host = ts.createCompilerHost(options);

  host.writeFile = (
    fileName,
    text
    // writeByteOrderMark,
    // onError,
    // sourceFiles
  ) => {
    const srcIndex = fileName.indexOf("/src/");
    output.push({ fileName: fileName.substring(srcIndex + 1), content: text });
  };

  const program = ts.createProgram(fileNames, options, host);
  program.emit();

  const emitResult = program.emit();

  const allDiagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(emitResult.diagnostics);

  if (emitResult.emitSkipped) {
    console.log("Emitting .d.ts files failed.");
    return;
  }

  return output;
};

router.post("/create", async (req, res) => {
  const body = req.body;
  console.log("body", body);
  createFiles(body);
  res.send({ success: "ok" });
});

router.post("/type", async (req, res) => {
  const body = req.body;
  const out = await createProgram(body);
  console.log("out", out);
  res.send(out);
});

export default router;
