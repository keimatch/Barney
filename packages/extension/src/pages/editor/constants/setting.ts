import ts from "typescript";
import { Setting } from "../../../types/editor";

export const defaultSetting: Setting = {
  id: "setting",
  enableBundle: false,
  esmVersion: ts.ScriptTarget.ESNext,
};
