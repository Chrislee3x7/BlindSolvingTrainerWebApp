import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { createContext, useState, useContext, ReactNode, useCallback } from "react";

export type DialogOptions = {
  title: string;
  description?: string;
  actionLabel?: string;
  actionVariant?: "default" | "destructive" | "outline" | null | undefined;
  cancelLabel?: string;
  onConfirm?: () => void;
  children?: ReactNode;
};

type DialogContextType = {
  showDialog: (options: DialogOptions) => void;
};

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export const DialogProvider = ({ children }: { children: ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialog, setDialog] = useState<DialogOptions | null>(null);

  const showDialog = useCallback((options: DialogOptions) => {
    setDialog(options);
    setIsOpen(true);
  }, []);

  const handleConfirm = () => {
    dialog?.onConfirm?.();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{dialog?.title}</DialogTitle>
            {dialog?.description && (
              <DialogDescription>{dialog.description}</DialogDescription>
            )}
          </DialogHeader>
          {dialog?.children && (
            <div className="py-2">{dialog.children}</div>
          )}
          <DialogFooter>
            <Button variant="secondary" onClick={handleCancel}>
              {dialog?.cancelLabel}
            </Button>
            <Button variant={dialog?.actionVariant} onClick={handleConfirm}>
              {dialog?.actionLabel}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DialogContext.Provider>
  );
};

export const useDialogContext = () => {
  const context = useContext(DialogContext);
  if (!context) throw new Error("useDialogContext must be used within DialogProvider");
  return context;
};