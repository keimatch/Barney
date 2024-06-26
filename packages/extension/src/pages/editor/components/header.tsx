import React from "react";
import { IconButton, Box, InputGroup, Input, Tooltip } from "@chakra-ui/react";
import { VscChevronLeft, VscSave, VscSettingsGear } from "react-icons/vsc";
import { SiRollupdotjs } from "react-icons/si";
import { PiTextIndentBold } from "react-icons/pi";
import { Setting } from "../../../types/editor";
import { SettingMenu } from "./setting";

const Header = ({
  name,
  isEdited,
  moveToFileList,
  handleFormat,
  onChangeName,
  onSave,
  bundle,
  setting,
  setSetting,
}: {
  name: string;
  isEdited: boolean;
  setting: Setting;
  handleFormat: () => void;
  moveToFileList: () => void;
  onChangeName: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
  bundle: () => void;
  setSetting: (setting: Setting) => Promise<void>;
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
        <Tooltip label="Home" fontSize="xs">
          <IconButton
            aria-label="Home"
            size="sm"
            icon={<VscChevronLeft />}
            variant="ghost"
            onClick={() => {
              moveToFileList();
            }}
          />
        </Tooltip>
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
              placeholder="Type file name..."
              value={name || ""}
              onChange={onChangeName}
            />
          </InputGroup>
        </Box>
      </Box>
      <Box display="flex" gap={1}>
        <Tooltip label="Bundle" fontSize="xs">
          <IconButton
            aria-label="bundle"
            size="sm"
            hidden={!setting.enableBundle}
            icon={<SiRollupdotjs />}
            variant="ghost"
            onClick={bundle}
          />
        </Tooltip>
        <Tooltip label="Format" fontSize="xs">
          <IconButton
            aria-label="format"
            size="sm"
            icon={<PiTextIndentBold />}
            variant="ghost"
            onClick={handleFormat}
          />
        </Tooltip>
        <Tooltip label="Save" fontSize="xs">
          <IconButton
            aria-label="save"
            size="sm"
            icon={<VscSave />}
            variant="ghost"
            disabled={!isEdited}
            onClick={() => {
              onSave();
            }}
          />
        </Tooltip>

        <SettingMenu setting={setting} setSetting={setSetting} />
      </Box>
    </Box>
  );
};

export { Header };
