import React, {
  ReactElement,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useLiveQuery } from "dexie-react-hooks";
import dayjs from "dayjs";

import { Experience, Node } from "../types/experience";
import { db } from "../db/experience";
import { Result } from "../util/type";

type ContextValue = [
  { experiences: Experience[]; selectedExperience: Experience | undefined },
  {
    addExperience: () => Promise<Experience>;
    selectExperience: (experience: Experience) => void;
    deleteExperience: (experience: Experience) => void;
    updateExperience: (experience: Experience) => Promise<Result<null>>;
  }
];

const defaultValue: ContextValue = [
  {
    experiences: [],
    selectedExperience: undefined,
  },
  {
    addExperience: async () => ({
      id: dayjs().unix(),
      name: "untitled",
      createdAt: dayjs().unix(),
      url: "",
      folder: {
        type: "folder",
        id: "1",
        name: "src",
        parentId: undefined,
        children: [],
      },
    }),
    selectExperience: () => {},
    deleteExperience: (ex) => {},
    updateExperience: (ex) => new Promise((r) => r),
  },
];

export const defaultFolderRoot: Node = {
  id: "1",
  name: "src",
  parentId: undefined,
  type: "folder",
  children: [
    {
      id: "2",
      name: "main.ts",
      parentId: "1",
      type: "typescript",
      content: "",
    },
    {
      id: "3",
      name: "styles.css",
      parentId: "1",
      type: "css",
      content: "p {color: red;}",
    },
    {
      id: "4",
      name: "readme.md",
      parentId: "1",
      type: "markdown",
      content: "# Hello",
    },
  ],
};

const ExperienceContext = createContext<ContextValue>(defaultValue);
export const useExperience = () => {
  return useContext(ExperienceContext);
};

export const ExperienceProvider = ({
  children,
}: {
  children: ReactElement;
}) => {
  const experiences = useLiveQuery(() => db.experiences.toArray());
  const [selectedExperience, setSelectedExperience] = useState<
    Experience | undefined
  >();

  const addExperience = useCallback(async () => {
    const timestamp = dayjs().unix();
    const newExperience: Experience = {
      id: timestamp,
      name: "untitled",
      createdAt: timestamp,
      url: "any-url",
      folder: defaultFolderRoot,
    };
    await db.experiences.add(newExperience);
    return newExperience;
  }, []);

  const deleteExperience = useCallback(async (removalEx: Experience) => {
    await db.experiences.delete(removalEx.id);
  }, []);

  const selectExperience = useCallback((ex: Experience) => {
    setSelectedExperience(ex);
  }, []);

  const validateExperience = useCallback(
    (experience: Experience): Result<null> => {
      if (!experience.name) {
        return { success: false, error: "name is required" };
      }
      if (!experience.url) {
        return { success: false, error: "url is required" };
      }
      if (!experience.folder) {
        return { success: false, error: "folder is required" };
      }
      return { success: true, value: null };
    },
    []
  );

  const updateExperience = useCallback(
    async (newExperience: Experience): Promise<Result<null>> => {
      const validate = validateExperience(newExperience);
      if (!validate.success) {
        return validate;
      }
      await db.experiences.update(newExperience.id, newExperience);

      selectExperience(newExperience);
      return validate;
    },
    [selectExperience, validateExperience]
  );

  const value: ContextValue = [
    {
      experiences: experiences || [],
      selectedExperience,
    },
    {
      addExperience,
      selectExperience,
      deleteExperience,
      updateExperience,
    },
  ];

  return (
    <ExperienceContext.Provider value={value}>
      {children}
    </ExperienceContext.Provider>
  );
};
