import ts from "typescript";
import { Language } from "./experience";

export interface Message {
  type: "INIT" | "EXECUTE_SCRIPT" | "INSERT_CSS" | "QUICK_RELOAD";
  script?: string;
  css?: string;
  tabId: number;
}

export interface INIT_MESSAGE extends Message {
  type: "INIT";
}

export interface SCRIPT_MESSAGE extends Message {
  type: "EXECUTE_SCRIPT";
  script: string;
}

export interface CSS_MESSAGE extends Message {
  type: "INSERT_CSS";
  css: string;
}

export type FlatPath = {
  id: string;
  filename: string;
  data: string;
  type: Language;
};

export type Setting = {
  id: "setting";
  enableBundle: boolean;
  esmVersion: ts.ScriptTarget;
};
