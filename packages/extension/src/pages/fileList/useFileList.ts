import { Experience } from "../../types/experience";
import { useExperience } from "../../hooks/useExperience";
import { useRouter } from "../../hooks/useRouter";

export const useFileList = () => {
  const { moveTo } = useRouter();
  const [
    { experiences },
    { selectExperience, addExperience, deleteExperience },
  ] = useExperience();

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
  return [{ experiences }, { onCreate, onDelete, onSelect }] as const;
};
