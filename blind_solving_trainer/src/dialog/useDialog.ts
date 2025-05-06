import { useDialogContext, DialogOptions } from "./DialogProvider";

export const useDialog = () => {
  const { showDialog } = useDialogContext();

  const confirm = (options: DialogOptions) => {
    showDialog(options);
  };

  return { confirm };
};