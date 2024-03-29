export interface Experience {
  id: number;
  name: string;
  createdAt: number;
  updatedAt: number;
  url: string;
  folder: Node;
}

export type Language =
  | "typescript"
  | "css"
  | "html"
  | "javascript"
  | "markdown";
export type NodeType = "folder" | Language;

export interface Node {
  id: string;
  name: string;
  parentId?: string;
  type: NodeType;
  children?: Node[];
  content?: string;
  hidden?: boolean;
}
