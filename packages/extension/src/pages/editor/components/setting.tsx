import React, { useCallback, useMemo } from "react";
import {
  IconButton,
  Box,
  InputGroup,
  Input,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Switch,
  FormControl,
  FormLabel,
  MenuItemOption,
  MenuOptionGroup,
} from "@chakra-ui/react";
import { VscChevronLeft, VscSave, VscSettingsGear } from "react-icons/vsc";
import { Setting } from "../../../types/editor";

const SettingMenu = ({
  setting,
  setSetting,
}: {
  setting: Setting;
  setSetting: (setting: Setting) => Promise<void>;
}) => {
  const onChangeEnableBundle = useCallback(() => {
    setSetting({ ...setting, enableBundle: !setting.enableBundle });
  }, [setting, setSetting]);

  return (
    <Box width={7} display="flex" justifyContent="center" alignItems="center">
      <Menu closeOnSelect={false}>
        <MenuButton
          as={IconButton}
          aria-label="Options"
          icon={<VscSettingsGear />}
          variant="ghost"
          size="xs"
        />
        <MenuList>
          <MenuItem>
            <FormControl display="flex" alignItems="center">
              <Switch
                id="email-alerts"
                isChecked={setting.enableBundle}
                onChange={onChangeEnableBundle}
                mr={3}
              />
              <FormLabel htmlFor="email-alerts" mb="0" fontSize="12px">
                Enable Build
              </FormLabel>
            </FormControl>
          </MenuItem>
        </MenuList>
      </Menu>
    </Box>
  );
};

export { SettingMenu };
