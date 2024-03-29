import type {
  CSS_MESSAGE,
  INIT_MESSAGE,
  Message,
  SCRIPT_MESSAGE,
} from "../types/editor";
import { transpile } from "../pages/editor/logics/editor";

const backgroundPageConnection = chrome.runtime.connect({
  name: "panel",
});

const sendMessage = <T extends Message>(message: T) => {
  backgroundPageConnection.postMessage(message);
};

export const initializeMessage = () => {
  sendMessage<INIT_MESSAGE>({
    type: "INIT",
    tabId: chrome.devtools.inspectedWindow.tabId,
  });
};

export const injectScript = (jsCode: string) => {
  sendMessage<SCRIPT_MESSAGE>({
    type: "EXECUTE_SCRIPT",
    script: jsCode,
    tabId: chrome.devtools.inspectedWindow.tabId,
  });
};

export const insertCss = (css: string) => {
  if (!css) {
    console.error("empty css");
    return;
  }
  sendMessage<CSS_MESSAGE>({
    type: "INSERT_CSS",
    css,
    tabId: chrome.devtools.inspectedWindow.tabId,
  });
};

export const clearCss = () => {
  sendMessage<CSS_MESSAGE>({
    type: "INSERT_CSS",
    css: "",
    tabId: chrome.devtools.inspectedWindow.tabId,
  });
};
