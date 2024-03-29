import React, { useCallback } from "react";
import MonacoEditor, {
  BeforeMount,
  OnMount,
  OnChange,
} from "@monaco-editor/react";
import monaco from "monaco-editor";

import { IconButton, Box, Tooltip } from "@chakra-ui/react";
import { VscDebugStart } from "react-icons/vsc";
import { GrClearOption } from "react-icons/gr";
import { SiTypescript, SiJavascript } from "react-icons/si";
import { Language } from "../../../types/experience";
import { FlatPath } from "../../../types/editor";
import { BUNDLE_FILE_ID } from "../logics/editor";

export const Editor = ({
  beforeMount,
  onMount,
  onChangeMonaco,
  changeScriptType,
  handleInjectScript,
  handleInsertCss,
  handleClearCss,
  scriptType,
  selectedNode,
  options,
}: {
  beforeMount: BeforeMount;
  onMount: OnMount;
  onChangeMonaco: OnChange;
  changeScriptType: (type: "javascript" | "typescript") => () => void;
  handleInjectScript: ({
    code,
    type,
  }: {
    code: string;
    type: Extract<Language, "typescript" | "javascript">;
  }) => void;
  handleInsertCss: () => void;
  handleClearCss: () => void;
  options: monaco.editor.IEditorOptions;
  selectedNode: FlatPath | undefined;
  scriptType: Language;
}) => {
  const onInjectScript = useCallback(() => {
    if (!selectedNode) {
      console.error("no selected node");
      return;
    }

    const selectedNodeType = selectedNode.type;

    if (
      selectedNodeType === "typescript" ||
      selectedNodeType === "javascript"
    ) {
      handleInjectScript({
        code: selectedNode.data,
        type: selectedNodeType,
      });
    }
  }, [handleInjectScript, selectedNode]);

  return (
    <Box pos="relative" height="100%" width="100%">
      <MonacoEditor
        theme="vs-dark"
        beforeMount={beforeMount}
        onMount={onMount}
        onChange={onChangeMonaco}
        options={options}
      />

      <Box pos="absolute" display="flex" gap={1} top={2} right={4}>
        {selectedNode?.type === "typescript" && (
          <>
            <Tooltip label="Execute script" fontSize="xs">
              <IconButton
                aria-label="execute script"
                size="xs"
                icon={<VscDebugStart />}
                onClick={onInjectScript}
              />
            </Tooltip>
            <Tooltip label="Switch Script Type" fontSize="xs">
              <IconButton
                aria-label="switch script type"
                size="xs"
                colorScheme={scriptType === "typescript" ? "blue" : "yellow"}
                icon={
                  scriptType === "typescript" ? (
                    <SiTypescript />
                  ) : (
                    <SiJavascript />
                  )
                }
                onClick={
                  scriptType === "javascript"
                    ? changeScriptType("typescript")
                    : changeScriptType("javascript")
                }
              />
            </Tooltip>
          </>
        )}
        {selectedNode?.id === BUNDLE_FILE_ID && (
          <Tooltip label="Bundle" fontSize="xs">
            <IconButton
              aria-label="bundle"
              size="xs"
              icon={<VscDebugStart />}
              onClick={onInjectScript}
            />
          </Tooltip>
        )}
        {selectedNode?.type === "css" && (
          <>
            <Tooltip label="Clear CSS" fontSize="xs">
              <IconButton
                aria-label="clear css"
                size="xs"
                icon={<GrClearOption />}
                onClick={handleClearCss}
              />
            </Tooltip>
            <Tooltip label="Insert CSS" fontSize="xs">
              <IconButton
                aria-label="insert css"
                size="xs"
                icon={<VscDebugStart />}
                onClick={handleInsertCss}
              />
            </Tooltip>
          </>
        )}
      </Box>
    </Box>
  );
};
