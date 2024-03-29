import * as monaco from "monaco-editor";
import ts from "typescript";
import { Language, Node, NodeType } from "../../../types/experience";
import { FlatPath } from "../../../types/editor";

export const BUNDLE_FILE_ID = "bundle";

export const updateNodePropertyById = <T extends keyof Node>(
  node: Node,
  targetId: string,
  propName: T,
  newValue: Node[T] | ((children: Node[T]) => Node[T])
) => {
  if (node.id === targetId) {
    if (typeof newValue === "function") {
      node[propName] = newValue(node[propName]);
    } else {
      node[propName] = newValue;
    }

    return node;
  }

  if (node.type === "folder" && node.children) {
    node.children = node.children.map((child) =>
      updateNodePropertyById(child, targetId, propName, newValue)
    );
  }

  return node;
};

export const transpile = (
  tsCode: string,
  esmVersion = ts.ScriptTarget.ESNext
) => {
  const jsCode = ts.transpileModule(tsCode, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: esmVersion,
    },
  });
  return jsCode.outputText;
};

export const duplicateTsAsJs = (node: Node): Node => {
  if (node.type === "folder" && node.children) {
    const newChildren: Node[] = [];

    node.children.forEach((child) => {
      const newChild = duplicateTsAsJs(child);
      newChildren.push(newChild);

      if (newChild.type === "typescript") {
        const jsVersionExists = node.children?.some(
          (c) =>
            c.name === newChild.name.replace(/\.ts$/, ".js") &&
            c.type === "javascript"
        );
        if (!jsVersionExists) {
          const jsVersion: Node = {
            ...newChild,
            id: convertToJsId(newChild.id),
            name: newChild.name.replace(/\.ts$/, ".js"),
            type: "javascript",
            content: transpile(newChild.content || ""),
            hidden: true,
          };
          newChildren.push(jsVersion);
        }
      }
    });
    node.children = newChildren;
  }

  return node;
};

export const convertToJsId = (id: string) => {
  return id + "-js";
};

const EXTENSION_MAP: Record<Language, string> = {
  typescript: "ts",
  javascript: "js",
  css: "css",
  html: "html",
};

export const addExtensionToFileName = (name: string, type: NodeType) => {
  if (type === "folder") return name;
  return `${name}.${EXTENSION_MAP[type]}`;
};

export const trimString = (str: string, pattern: string) => {
  const regex = new RegExp("^" + pattern + "|" + pattern + "$", "g");
  return str.replace(regex, "");
};

export const getCurrentModelPaths = (monacoInstance: typeof monaco) => {
  return monacoInstance.editor
    .getModels()
    .map((model) => trimString(model.uri.path, "/"))
    .filter((path) => path !== "1");
};

export const findModelByPath = (
  monacoInstance: typeof monaco,
  path: string
) => {
  return monacoInstance.editor.getModels().find((model) => {
    return trimString(model.uri.path, "/") === trimString(path, "/");
  });
};

const digForTransform = (folder: Node, parentName?: string) => {
  const res: FlatPath[] = [];
  const fs = folder.children?.find((child) => child.type === "folder") as
    | Node
    | undefined;

  if (fs) {
    const childFiles = digForTransform(fs, parentName + "/" + fs.name);
    res.push(...childFiles);
  }

  const files = folder.children?.filter(
    (child) => child.type !== "folder"
  ) as Node[];
  // --
  const filepaths: FlatPath[] = files.map((file) => ({
    filename: parentName + "/" + file.name,
    data: file.content || "",
    id: file.id,
    type: file.type as Language,
  }));
  res.push(...filepaths);
  return res;
};

export const transform = (root: Node): FlatPath[] => {
  const files = digForTransform(root, root.name);
  return files;
};
export const findPathById = (
  files: Node[],
  fileId: string,
  currentPath: string = ""
): string | null => {
  for (const file of files) {
    const newPath = `${currentPath}/${file.name}`;

    // 目的のファイルまたはフォルダが見つかった場合
    if (file.id === fileId) {
      return monaco.Uri.from({
        scheme: "file",
        path: newPath,
      }).path;
    }
    if (file.type === "folder" && file.children) {
      const path = findPathById(file.children, fileId, newPath);
      // ネストされた子要素の中に目的のファイルまたはフォルダが見つかった場合
      if (path) {
        return monaco.Uri.from({
          scheme: "file",
          path: path,
        }).path;
      }
    }
  }
  return null; // 該当するファイルまたはフォルダが見つからなかった場合
};

export const preBundle = (files: FlatPath[]) => {
  // jsのファイルを取り出す
  const jsFiles = files.filter((file) => file.type === "javascript");
  // item.filenameから拡張子を取り除いたものをnameとする
  const virtualFiles: Record<string, string> = {};
  jsFiles.forEach((item) => {
    const name = item.filename.replace(/\..+$/, "");
    virtualFiles[name] = item.data;
  });

  return virtualFiles;
};

export const extractTsContents = (
  node: Node
): { id: string; content: string }[] => {
  const ids: ReturnType<typeof extractTsContents> = [];

  // node.typeが'typescript'の場合のみidを追加
  if (node.type === "typescript") {
    ids.push({ id: node.id, content: node.content! });
  }

  // 子ノードが存在する場合、それらのidも条件に基づいて再帰的に抽出
  if (node.children) {
    node.children.forEach((child) => {
      ids.push(...extractTsContents(child));
    });
  }

  return ids;
};
