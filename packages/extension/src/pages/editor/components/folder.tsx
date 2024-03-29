import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  IconButton,
  Input,
  useOutsideClick,
} from "@chakra-ui/react";
import {
  VscChevronDown,
  VscKebabVertical,
  VscFolder,
  VscFileCode,
  VscChevronRight,
} from "react-icons/vsc";
import { RiDeleteBin3Line } from "react-icons/ri";

import { Language, Node, NodeType } from "../../../types/experience";
import { File } from "./file";

const offsetPd = 5;

const Folder = ({
  folder,
  depth = 0,
  selectedNodeId,
  onSelectNode,
  handleCreateFile,
  handleDeleteFile,
  onChangeName,
}: {
  folder: Node;
  depth?: number;
  selectedNodeId: string | undefined;
  onSelectNode: (nodeId: string) => void;
  onChangeName: (nodeId: string, value: string) => void;
  handleCreateFile: ({
    parentId,
    type,
  }: {
    parentId: string;
    type: NodeType;
  }) => void;
  handleDeleteFile: (nodeId: string, parentId: string) => void;
}) => {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isFolderOpen, setIsFolderOpen] = useState(true);
  const [didOutsideClicked, setDidOutsideClicked] = useState(false);

  const [editingNode, setEditingNode] = useState<string | undefined>(undefined);
  const toggleOpen = useCallback(() => {
    setIsFolderOpen(!isFolderOpen);
  }, [isFolderOpen]);

  const paddingLeft = offsetPd + depth * 20;

  const isEditing = useMemo(() => {
    return editingNode === folder.id;
  }, [editingNode, folder.id]);

  const onCreateFile = useCallback(
    (fileType: Language) => () => {
      handleCreateFile({ parentId: folder.id, type: fileType });
    },
    [folder.id, handleCreateFile]
  );

  const onCreateFolder = useCallback(() => {
    handleCreateFile({ parentId: folder.id, type: "folder" });
  }, [folder.id, handleCreateFile]);

  const onDeleteFile = useCallback(() => {
    if (!folder.parentId) {
      console.error("parentId is not found");
      return;
    }
    const result = confirm("削除していいの？");
    if (!result) return;
    handleDeleteFile(folder.id, folder.parentId);
  }, [folder.id, folder.parentId, handleDeleteFile]);

  const onStartEdit = useCallback(
    (nodeId: string | undefined) => () => {
      setEditingNode(nodeId);
    },
    []
  );

  const onEnter = useCallback(
    (e: KeyboardEvent) => {
      if (editingNode && e.key === "Enter") {
        setEditingNode(undefined);
      }
    },
    [editingNode]
  );

  const onMenuOpen = useCallback(() => {
    setIsMenuOpen(true);
  }, []);

  const onMenuClose = useCallback(() => {
    setIsHover(false);
    setIsMenuOpen(false);
  }, []);

  const onMouseOver = useCallback(() => {
    setIsHover(true);
  }, [setIsHover]);

  const onMouseLeave = useCallback(() => {
    if (isMenuOpen) return;
    setIsHover(false);
  }, [setIsHover, isMenuOpen]);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.addEventListener("mouseenter", onMouseOver);
      boxRef.current.addEventListener("mouseleave", onMouseLeave);
    }
    return () => {
      const ref = boxRef;
      if (ref.current) {
        ref.current.removeEventListener("mouseenter", onMouseOver);
        ref.current.removeEventListener("mouseleave", onMouseLeave);
      }
    };
  }, [onMouseOver, onMouseLeave]);

  const handleOnChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeName(folder.id, e.target.value);
    },
    [folder.id, onChangeName]
  );

  useOutsideClick({
    ref: boxRef,
    handler: () => {
      if (!isEditing) return;
      setDidOutsideClicked(true);
    },
  });

  useEffect(() => {
    document.addEventListener("keydown", onEnter);
    return () => {
      document.removeEventListener("keydown", onEnter);
    };
  }, [onEnter]);

  return (
    <Box ref={boxRef}>
      <Box display="flex">
        <Box flex={1}>
          <Button
            onClick={toggleOpen}
            borderRadius={0}
            pl={`${paddingLeft}px`}
            display="flex"
            justifyContent="flex-start"
            width={"100%"}
            size="xs"
            variant="ghost"
            leftIcon={isFolderOpen ? <VscChevronDown /> : <VscChevronRight />}
          >
            {isEditing && !didOutsideClicked ? (
              <Input
                size="xs"
                value={folder.name}
                onChange={handleOnChangeName}
                autoFocus
              />
            ) : (
              folder.name
            )}
          </Button>
        </Box>
        {isHover && (
          <Box
            width={6}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Menu onOpen={onMenuOpen} onClose={onMenuClose}>
              <MenuButton
                textAlign="center"
                as={IconButton}
                borderRadius={0}
                aria-label="Options"
                icon={<VscKebabVertical />}
                variant="ghost"
                size="xs"
              />
              <MenuList>
                <MenuItem onClick={onCreateFolder} icon={<VscFolder />}>
                  New Folder
                </MenuItem>
                <MenuItem
                  onClick={onCreateFile("typescript")}
                  icon={<VscFileCode />}
                >
                  New Typescript
                </MenuItem>
                <MenuItem onClick={onCreateFile("css")} icon={<VscFileCode />}>
                  New CSS
                </MenuItem>
                <MenuItem
                  onClick={onCreateFile("markdown")}
                  icon={<VscFileCode />}
                >
                  New Markdown
                </MenuItem>
                <MenuItem
                  onClick={onStartEdit(folder.id)}
                  icon={<VscFileCode />}
                >
                  Edit File Name
                </MenuItem>
                <MenuDivider />
                <MenuItem onClick={onDeleteFile} icon={<RiDeleteBin3Line />}>
                  Delete Folder
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </Box>
      <Box hidden={!isFolderOpen}>
        {folder.children?.map((child) => {
          if (child.type === "folder") {
            return (
              <Folder
                folder={child}
                depth={depth + 1}
                selectedNodeId={selectedNodeId}
                onSelectNode={onSelectNode}
                handleCreateFile={handleCreateFile}
                onChangeName={onChangeName}
                handleDeleteFile={handleDeleteFile}
              />
            );
          }
          return (
            <Box hidden={child.hidden}>
              <File
                isSelected={child.id === selectedNodeId}
                isEditing={child.id === editingNode}
                onClick={onSelectNode}
                file={child}
                depth={depth + 1}
                onChangeName={onChangeName}
                onStartEdit={onStartEdit}
                handleDeleteFile={handleDeleteFile}
              />
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export { Folder };
