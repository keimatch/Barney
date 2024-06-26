import React, { useCallback, useMemo, useState } from "react";
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
  Select,
  MenuDivider,
  Button,
  Tooltip,
  Text,
} from "@chakra-ui/react";
import { VscChevronDown, VscSave, VscSettingsGear } from "react-icons/vsc";
import { Setting } from "../../../types/editor";
import ts from "typescript";

const SettingMenu = ({
  setting,
  setSetting,
}: {
  setting: Setting;
  setSetting: (setting: Setting) => Promise<void>;
}) => {
  const [esmMenuOpen, setEsmMenuOpen] = useState(false);

  const onChangeEnableBundle = useCallback(() => {
    setSetting({ ...setting, enableBundle: !setting.enableBundle });
  }, [setting, setSetting]);

  const onChangeEsmVersion = useCallback(
    (value: string | string[]) => {
      if (typeof value !== "string") {
        console.error("invalid value");
        return;
      }
      const version = parseInt(value, 10) as ts.ScriptTarget;
      setSetting({ ...setting, esmVersion: version });
    },
    [setting, setSetting]
  );

  const toggleEsmMenu = useCallback(() => {
    setEsmMenuOpen((prev) => !prev);
  }, []);

  const handleCloseEsmMenu = useCallback(() => {
    setEsmMenuOpen(false);
  }, []);

  return (
    <Box width={7} display="flex" justifyContent="center" alignItems="center">
      <Menu closeOnSelect={false}>
        <Tooltip label="Setting" fontSize="xs">
          <MenuButton
            as={IconButton}
            aria-label="Options"
            icon={<VscSettingsGear />}
            variant="ghost"
            size="xs"
          />
        </Tooltip>
        <MenuList>
          <MenuItem>
            <FormControl display="flex" alignItems="center">
              <Switch
                id="bundle-switch"
                isChecked={setting.enableBundle}
                onChange={onChangeEnableBundle}
                mr={3}
              />
              <FormLabel htmlFor="bundle-switch" mb="0" fontSize="12px">
                Enable Bundle
              </FormLabel>
            </FormControl>
          </MenuItem>
          <MenuDivider />
          <Menu
            closeOnSelect={false}
            placement="left"
            isOpen={esmMenuOpen}
            onClose={handleCloseEsmMenu}
          >
            <MenuButton
              as={Button}
              onClick={toggleEsmMenu}
              leftIcon={<VscChevronDown />}
              width="100%"
              pl={5}
              display="flex"
              justifyContent="flex-start"
              variant="ghost"
              borderRadius={0}
              size="xs"
              textAlign="left"
            >
              <Text fontSize="12px" pl={4}>
                Target ESM Version
              </Text>
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                value={setting.esmVersion.toString()}
                onChange={onChangeEsmVersion}
                type="radio"
              >
                <MenuItemOption value={ts.ScriptTarget.ES3.toString()}>
                  ES3
                </MenuItemOption>
                <MenuItemOption value={ts.ScriptTarget.ES5.toString()}>
                  ES5
                </MenuItemOption>
                <MenuItemOption value={ts.ScriptTarget.ES2015.toString()}>
                  ES2015
                </MenuItemOption>
                <MenuItemOption value={ts.ScriptTarget.ESNext.toString()}>
                  ESNext
                </MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
        </MenuList>
      </Menu>
    </Box>
  );
};

export { SettingMenu };
