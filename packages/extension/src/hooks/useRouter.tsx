import React, {
  ReactElement,
  createContext,
  useContext,
  useState,
} from "react";
import { FileList } from "../pages/fileList";
import { Editor } from "../pages/editor";

type Path = "filelist" | "editor";
type ContextValue = { currentPath: Path; moveTo: (to: Path) => void };
const defaultPath: Path = "filelist";
const defaultValue: ContextValue = {
  currentPath: defaultPath,
  moveTo: (p) => {},
};

const RouteContext = createContext<ContextValue>(defaultValue);

export const route: { [path: string]: () => React.JSX.Element } = {
  filelist: FileList,
  editor: Editor,
};

export const RouteProvider = ({ children }: { children: ReactElement }) => {
  const [current, setCurrent] = useState<Path>(defaultPath);

  const moveTo = (to: Path) => {
    setCurrent(to);
  };

  const value = {
    currentPath: current,
    moveTo,
  };

  return (
    <RouteContext.Provider value={value}>{children}</RouteContext.Provider>
  );
};

export const useRouter = () => {
  return useContext(RouteContext);
};
