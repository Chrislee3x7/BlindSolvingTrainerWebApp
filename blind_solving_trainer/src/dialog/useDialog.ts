import { useDialogContext, DialogOptions } from "./DialogProvider";

export const useDialog = () => {
  const { showDialog } = useDialogContext();

  const dialog = (options: DialogOptions) => {
    showDialog(options);
  };

  return { dialog };
};