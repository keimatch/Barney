import React from "react";
import { Box } from "@chakra-ui/react";

import { useEditor } from "./hooks/useEditor";
import { Folder } from "./components/folder";
import { Header } from "./components/header";
import { Editor as MonacoEditorContainer } from "./components/editor";

// loader.init().then((monaco) => {
//   monaco.languages.typescript.typescriptDefaults.setCompilerOptions({});
// });

const Editor = () => {
  const [
    {
      files: root,
      name,
      url,
      isEdited,
      scriptType,
      selectedNodeId,
      selectedNode,

      monacoOptions,
      setting,
    },
    {
      onChangeMeta,
      handleFormat,
      onSave,
      handleCreateFile,
      handleDeleteFile,

      changeScriptType,
      moveToFileList,
      handleInjectScript,
      handleInsertCss,
      handleClearCss,
      onChangeFileMeta,

      beforeMount,
      onMount,
      onChangeMonaco,
      handleSelectNode,

      bundle,
      saveSetting,
    },
  ] = useEditor();

  return (
    <Box
      id="editor-container"
      style={{ height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Header
        name={name}
        isEdited={isEdited}
        setting={setting}
        moveToFileList={moveToFileList}
        handleFormat={handleFormat}
        onChangeName={onChangeMeta("name")}
        onSave={onSave}
        bundle={bundle}
        setSetting={saveSetting}
      />

      <Box id="main-container" flex={1} display="flex">
        <Box
          borderRight="0.5px solid rgba(255, 255,255,0.1)"
          overflowX="hidden"
          width="200px"
        >
          <Folder
            folder={root}
            selectedNodeId={selectedNodeId}
            onSelectNode={handleSelectNode}
            handleCreateFile={handleCreateFile}
            onChangeName={onChangeFileMeta("name")}
            handleDeleteFile={handleDeleteFile}
          />
        </Box>
        <Box flex={1}>
          <MonacoEditorContainer
            beforeMount={beforeMount}
            onMount={onMount}
            onChangeMonaco={onChangeMonaco("content")}
            changeScriptType={changeScriptType}
            handleInjectScript={handleInjectScript}
            handleInsertCss={handleInsertCss}
            handleClearCss={handleClearCss}
            scriptType={scriptType}
            selectedNode={selectedNode}
            options={monacoOptions}
          />
        </Box>
      </Box>
    </Box>
  );
};

export { Editor };
