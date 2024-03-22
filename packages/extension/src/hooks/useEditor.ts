import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as monaco from "monaco-editor";
import {
  BeforeMount,
  OnChange,
  OnMount,
  useMonaco,
} from "@monaco-editor/react";

import { useRouter } from "./useRouter";
import { Node, Language, NodeType } from "../types/experience";
import { useExperience, defaultFolderRoot } from "./useExperience";

import {
  clearCss,
  injectScript,
  insertCss,
  initializeMessage,
} from "../logics/connecter";
import {
  addExtensionToFileName,
  convertToJsId,
  duplicateTsAsJs,
  findModelByPath,
  getCurrentModelPaths,
  updateNodePropertyById,
  transpile,
  transform,
  findPathById,
} from "../logics/editor";
import { difference, xor } from "../util/util";

export const useEditor = () => {
  // hooks ****************
  const { moveTo } = useRouter();
  const monaco = useMonaco();
  const [{ selectedExperience }, { updateExperience }] = useExperience();
  // ref ****************
  const leftEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const rightEditorRef = useRef<monaco.editor.IStandaloneCodeEditor>();
  const initialized = useRef(false);

  // state ****************
  const [folder, setFolder] = useState<Node>(() => {
    const cloned =
      structuredClone(selectedExperience?.folder) || defaultFolderRoot;
    return duplicateTsAsJs(cloned);
  });
  const [name, setName] = useState<string>(selectedExperience?.name || "");
  const [url, setUrl] = useState<string>(selectedExperience?.url || "");
  const [selectedNodeId, setSelectedNodeId] = useState<string | undefined>();

  // state - editor ****************
  const [scriptType, setScriptType] = useState<Language>("typescript");
  const [isEditedAfterSave, setIsEditedAfterSave] = useState(false);

  // memo ****************
  const monacoFiles = useMemo(() => {
    return transform(folder);
  }, [folder]);

  const selectedNode = useMemo(() => {
    return monacoFiles.find((file) => file.id === selectedNodeId);
  }, [selectedNodeId, monacoFiles]);

  const monacoOptions: monaco.editor.IEditorOptions = useMemo(() => {
    return {
      minimap: { enabled: false },
      readOnly: scriptType === "javascript",
    };
  }, [scriptType]);

  // func ****************
  // func - update experience ****************
  const onChange = useCallback(
    (nodeId: string, value: string, key: keyof Node) => {
      if (!monaco) return;
      const newFolder = updateNodePropertyById(folder, nodeId, key, value);

      if (key !== "content") {
        setFolder({ ...newFolder });
      } else {
        if (scriptType !== "typescript") {
          setFolder({ ...newFolder });
        } else {
          const compiledFolder = updateNodePropertyById(
            newFolder,
            convertToJsId(nodeId),
            key,
            transpile(value)
          );
          const jsModel = monaco.editor.getModel(
            monaco.Uri.from({
              scheme: "file",
              path: findPathById([compiledFolder], convertToJsId(nodeId)) || "",
            })
          );
          if (!jsModel) {
            console.error("jsModel is not found");
            return;
          }
          jsModel.setValue(transpile(value));
          setFolder({ ...compiledFolder });
        }
      }

      setIsEditedAfterSave(true);
    },
    [folder, scriptType, monaco]
  );

  const onChangeMeta = useCallback(
    (key: "url" | "name") => (e: React.ChangeEvent<HTMLInputElement>) => {
      setIsEditedAfterSave(true);
      if (key === "name") {
        setName(e.target.value);
      } else if (key === "url") {
        setUrl(e.target.value);
      }
    },
    []
  );

  const onSave = useCallback(async () => {
    if (!selectedExperience) {
      console.error("selectedExperience is not found");
      return;
    }
    if (!isEditedAfterSave) {
      console.info("no change");
      return;
    }
    const exp = structuredClone(selectedExperience);
    exp.folder = folder;
    exp.name = name;
    exp.url = url;
    await updateExperience(exp);
    setIsEditedAfterSave(false);
  }, [
    folder,
    name,
    url,
    isEditedAfterSave,
    selectedExperience,
    updateExperience,
  ]);

  // func - editor ****************
  const moveToFileList = useCallback(() => {
    if (isEditedAfterSave) {
      const result = confirm("未保存の変更がありますがいいの？");
      if (!result) return;
    }
    moveTo("filelist");
  }, [isEditedAfterSave, moveTo]);

  const handleFormat = useCallback(() => {
    leftEditorRef.current?.getAction("editor.action.formatDocument")?.run();
    rightEditorRef.current?.getAction("editor.action.formatDocument")?.run();
  }, []);

  const changeScriptType = useCallback(
    (to: "typescript" | "javascript") => () => {
      if (!selectedNodeId) {
        console.error("selectedNodeId is not found");
        return;
      }
      if (!monaco) {
        console.error("monaco is not found");
        return;
      }
      if (to === "javascript") {
        const jsId = convertToJsId(selectedNodeId);
        const path = findPathById([folder], jsId);
        if (!path) {
          console.error("path is not found");
          return;
        }
        const model = monaco.editor.getModel(
          monaco.Uri.from({
            scheme: "file",
            path,
          })
        );

        if (!model) {
          console.error("model is not found");
          return;
        }
        leftEditorRef.current?.setModel(model);
      } else {
        const path = findPathById([folder], selectedNodeId);
        if (!path) {
          console.error("path is not found");
          return;
        }
        const model = monaco.editor.getModel(
          monaco.Uri.from({
            scheme: "file",
            path,
          })
        );

        if (!model) {
          console.error("model is not found");
          return;
        }
        leftEditorRef.current?.setModel(model);
      }
      setScriptType(to);
    },
    [monaco, selectedNodeId, folder]
  );

  const onChangeMonaco = useCallback(
    (key: keyof Node): OnChange =>
      (value) => {
        if (!selectedNodeId || !value) return;
        onChange(selectedNodeId, value, key);
      },
    [selectedNodeId, onChange]
  );

  const onChangeFileMeta = useCallback(
    (key: keyof Node) => (nodeId: string, value: string) => {
      onChange(nodeId, value, key);
    },
    [onChange]
  );

  const handleSelectNode = useCallback((nodeId: string) => {
    setSelectedNodeId(nodeId);
  }, []);

  const handleInjectScript = useCallback(() => {
    if (selectedNode?.type !== "typescript") return;
    const tsCode = leftEditorRef.current?.getValue();
    if (!tsCode) return;
    injectScript(tsCode);
  }, [selectedNode]);

  const handleInsertCss = useCallback(() => {
    if (selectedNode?.type !== "css") return;
    const cssCode = leftEditorRef.current?.getValue();
    if (!cssCode) return;
    insertCss(cssCode);
  }, [selectedNode]);

  const updateModels = useCallback(() => {
    if (monaco === null) return;

    const currentMonacoFiles = new Set(
      monacoFiles.map((file) => file.filename)
    );

    // 新規作成ファイルのモデル追加
    difference(
      currentMonacoFiles,
      new Set(getCurrentModelPaths(monaco))
    ).forEach((path) => {
      console.info("created filepath is: ", path);
      const file = monacoFiles.find((file) => file.filename === path);
      if (!file) return;
      monaco.editor.createModel(
        file.data,
        file.type,
        monaco.Uri.from({
          scheme: "file",
          path: file.filename,
        })
      );
    });

    // ファイル移動によるモデル削除と登録
    xor(currentMonacoFiles, new Set(getCurrentModelPaths(monaco))).forEach(
      (path) => {
        console.info("moved filepath is: ", path);
        const model = findModelByPath(monaco, path);
        if (!model) {
          const file = monacoFiles.find((file) => file.filename === path);
          if (!file) return;
          monaco.editor.createModel(
            file.data,
            file.type,
            monaco.Uri.from({
              scheme: "file",
              path: file.filename,
            })
          );
        } else {
          model.dispose();
        }
      }
    );
  }, [monaco, monacoFiles]);

  const beforeMount: BeforeMount = useCallback(
    (monaco) => {
      updateModels();
      monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ES2016,
        module: monaco.languages.typescript.ModuleKind.ESNext,
        allowNonTsExtensions: false,
      });
    },
    [updateModels]
  );

  const onMount: OnMount = useCallback(
    (editor, monaco) => {
      leftEditorRef.current = editor;
      const initialFile = monacoFiles[0];
      setSelectedNodeId(initialFile.id);
      const initialModel = monaco.editor.getModel(
        monaco.Uri.from({
          scheme: "file",
          path: initialFile.filename,
        })
      );

      if (initialModel) {
        leftEditorRef.current.setModel(initialModel);
      }
    },
    [monacoFiles]
  );

  const createFile = useCallback(
    ({ parentId, type }: { parentId: string; type: NodeType }) => {
      const newFiles: Node[] = [];

      const id = Date.now().toString();
      const newFile: Node = {
        id: id,
        parentId,
        name: addExtensionToFileName(id, type),
        type,
        content: "",
      };

      const jsFile: Node = {
        id: convertToJsId(id),
        parentId,
        name: addExtensionToFileName(id, "javascript"),
        type: "javascript",
        content: "",
        hidden: true,
      };

      newFiles.push(newFile);
      newFiles.push(jsFile);

      const newFolder: Node = {
        id: id,
        name: id,
        parentId,
        type: "folder",
        children: [],
      };

      const updatedFolder = updateNodePropertyById(
        folder,
        parentId,
        "children",
        (children) => {
          if (!children) return [newFile];
          if (type === "folder") return [...children, newFolder];
          return [...children, ...newFiles];
        }
      );
      setFolder({ ...updatedFolder });
      setIsEditedAfterSave(true);
    },
    [folder]
  );

  const deleteFile = useCallback(
    (nodeId: string, parentId: string) => {
      const newFolder = updateNodePropertyById(
        folder,
        parentId,
        "children",
        (children) => {
          if (!children) return children;
          return [...children.filter((child) => child.id !== nodeId)];
        }
      );
      setFolder({ ...newFolder });
      setIsEditedAfterSave(true);
    },
    [folder]
  );

  //effect ****************
  // connecterの初期化
  useEffect(() => {
    if (initialized.current) return;
    initializeMessage();
    initialized.current = true;

    return () => {
      setIsEditedAfterSave(false);
    };
  }, []);

  // ファイル選択時のエディター切り替え
  useEffect(() => {
    if (!selectedNodeId || !monaco) return;
    const path = findPathById([folder], selectedNodeId);
    const selectedModel = monaco.editor
      .getModels()
      .find((model) => model.uri.path === path);
    if (!selectedModel) return;
    leftEditorRef.current?.setModel(selectedModel);
  }, [monaco, selectedNodeId, folder]);

  // ファイル追加時のモデル追加, 削除
  useEffect(() => {
    updateModels();
  }, [updateModels]);

  // unmount時のモデル削除
  useEffect(() => {
    return () => {
      if (monaco === null) return;
      monaco.editor.getModels().forEach((model) => model.dispose());
    };
  }, [monaco]);

  return [
    {
      files: folder,
      name,
      url,

      isEdited: isEditedAfterSave,
      scriptType,
      selectedNodeId,
      selectedNode,

      monacoOptions,
    },
    {
      onChangeMeta,
      changeScriptType,
      handleCreateFile: createFile,
      handleDeleteFile: deleteFile,

      handleInjectScript,
      handleInsertCss,
      handleClearCss: clearCss,

      moveToFileList,
      beforeMount,
      onMount,
      onChangeMonaco,
      handleSelectNode,
      onChangeFileMeta,

      handleFormat,
      onSave,
    },
  ] as const;
};
