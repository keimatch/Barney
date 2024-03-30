import { clearCss } from "./../../logics/connecter";
import { Experience } from "../../types/experience";
import { useExperience } from "../../hooks/useExperience";
import { useRouter } from "../../hooks/useRouter";
import React, { useCallback, useMemo, useState } from "react";
import { getFormattedDate } from "./utils/datetime";

export const useFileList = () => {
  const { moveTo } = useRouter();
  const [
    { experiences },
    { selectExperience, addExperience, deleteExperience },
  ] = useExperience();

  const [searchText, setSearchText] = useState<string>("");

  const filteredExperience = useMemo<Experience[]>(() => {
    if (!searchText) return experiences;
    return experiences.filter((e) => {
      return (
        e.name.includes(searchText) ||
        e.url.includes(searchText) ||
        e.description.includes(searchText) ||
        getFormattedDate(e.createdAt).includes(searchText) ||
        getFormattedDate(e.updatedAt).includes(searchText)
      );
    });
  }, [experiences, searchText]);

  const onCreate = async () => {
    const newEx = await addExperience();
    selectExperience(newEx);
    moveTo("editor");
  };

  const onDelete = (selectedExId: number) => {
    const ex = experiences.find((e) => e.id === selectedExId);
    if (!ex) return;
    deleteExperience(ex);
  };
  const onSelect = (selectedExId: number) => {
    const ex = experiences.find((e) => e.id === selectedExId);
    if (!ex) return;
    selectExperience(ex);
    moveTo("editor");
  };
  const onSearch = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchText(e.target.value);
    },
    [setSearchText]
  );

  const clearSearch = useCallback(() => {
    setSearchText("");
  }, [setSearchText]);

  return [
    { experiences: filteredExperience, searchText },
    { onCreate, onDelete, onSelect, onSearch, clearSearch },
  ] as const;
};
