import React from "react";
import { IconButton, Box, InputGroup, Input } from "@chakra-ui/react";
import { VscChevronLeft, VscSave } from "react-icons/vsc";
import { SiRollupdotjs } from "react-icons/si";
import { PiTextIndentBold } from "react-icons/pi";

const Header = ({
  name,
  isEdited,
  moveToFileList,
  handleFormat,
  onChangeName,
  onSave,
}: {
  name: string;
  isEdited: boolean;
  handleFormat: () => void;
  moveToFileList: () => void;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}) => {
  return (
    <Box
      id="header"
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      borderBottom="0.5px solid rgba(255, 255,255,0.1)"
    >
      <Box>
        <IconButton
          aria-label="back"
          size="sm"
          icon={<VscChevronLeft />}
          variant="ghost"
          onClick={() => {
            moveToFileList();
          }}
        />
        {/* <IconButton
            aria-label="back"
            size="sm"
            icon={<VscChevronLeft />}
            variant="ghost"
            // onClick={() => {
            //   changeFile();
            // }}
          /> */}
      </Box>
      <Box flex={1} overflowX="hidden" display="flex" justifyContent="center">
        {/* <input
            type="text"
            value={url}
            onChange={(v) => {
              setUrl(v.target.value);
            }}
          /> */}
        <Box width="100%" maxW={500}>
          <InputGroup size="sm">
            <Input
              variant="filled"
              textAlign="center"
              placeholder="phone number"
              value={name || "undefined"}
              onChange={onChangeName}
            />
          </InputGroup>
        </Box>
      </Box>
      <Box display="flex" gap={1}>
        <IconButton
          aria-label="back"
          size="sm"
          icon={<SiRollupdotjs />}
          variant="ghost"
          onClick={() => {
            // build(root);
          }}
        />
        <IconButton
          aria-label="back"
          size="sm"
          icon={<PiTextIndentBold />}
          variant="ghost"
          onClick={handleFormat}
        />
        <IconButton
          aria-label="back"
          size="sm"
          icon={<VscSave />}
          variant="ghost"
          disabled={!isEdited}
          onClick={() => {
            onSave();
          }}
        />
      </Box>
    </Box>
  );
};

export { Header };
