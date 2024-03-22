import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  IconButton,
  Input,
  useOutsideClick,
} from "@chakra-ui/react";
import { VscFile, VscKebabVertical, VscFileCode } from "react-icons/vsc";
import { SiTypescript, SiJavascript, SiCss3, SiHtml5 } from "react-icons/si";
import { RiDeleteBin3Line } from "react-icons/ri";

import { Language, Node } from "../../types/experience";

const offsetPd = 5;

const getIcon = (type: Language | "folder") => {
  if (type === "typescript") {
    return <SiTypescript />;
  } else if (type === "javascript") {
    return <SiJavascript />;
  } else if (type === "css") {
    return <SiCss3 />;
  } else if (type === "html") {
    return <SiHtml5 />;
  } else {
    return <VscFile />;
  }
};

const File = ({
  file,
  depth,
  isSelected,
  isEditing,
  onClick,
  onChangeName,
  onStartEdit,
  handleDeleteFile,
}: {
  file: Node;
  depth: number;
  isSelected: boolean;
  isEditing: boolean;
  onClick: (nodeId: string) => void;
  onChangeName: (nodeId: string, value: string) => void;
  onStartEdit: (nodeId: string | undefined) => () => void;
  handleDeleteFile: (nodeId: string, parentId: string) => void;
}) => {
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [isHover, setIsHover] = useState(false);
  const [didOutsideClicked, setDidOutsideClicked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const paddingLeft = offsetPd + depth * 20;
  const handleOnChangeName = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChangeName(file.id, e.target.value);
    },
    [file.id, onChangeName]
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
  }, []);

  const onMouseLeave = useCallback(() => {
    if (isMenuOpen) return;
    setIsHover(false);
  }, [isMenuOpen]);

  const onDeleteFile = useCallback(() => {
    if (!file.parentId) {
      console.error("parentId is not found");
      return;
    }
    const result = confirm("削除していいの？");
    if (!result) return;
    handleDeleteFile(file.id, file.parentId);
  }, [file.id, file.parentId, handleDeleteFile]);

  useOutsideClick({
    ref: boxRef,
    handler: () => {
      onStartEdit(undefined)();
    },
  });

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

  return (
    <Box
      ref={boxRef}
      onClick={() => {
        setDidOutsideClicked(false);
      }}
    >
      <Box display="flex">
        <Box flex={1}>
          <Button
            pl={`${paddingLeft}px`}
            borderRadius={0}
            width="100%"
            whiteSpace="normal"
            textOverflow="ellipsis"
            overflowX="hidden"
            display="flex"
            justifyContent="flex-start"
            size="xs"
            variant={isSelected ? "solid" : "ghost"}
            leftIcon={getIcon(file.type)}
            onClick={() => {
              onClick(file.id);
            }}
          >
            {isEditing ? (
              <Input
                size="xs"
                value={file.name}
                onChange={handleOnChangeName}
                autoFocus
              />
            ) : (
              file.name
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
                <MenuItem onClick={onStartEdit(file.id)} icon={<VscFileCode />}>
                  Edit File Name
                </MenuItem>
                <MenuItem onClick={onDeleteFile} icon={<RiDeleteBin3Line />}>
                  Delete File
                </MenuItem>
              </MenuList>
            </Menu>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export { File };
