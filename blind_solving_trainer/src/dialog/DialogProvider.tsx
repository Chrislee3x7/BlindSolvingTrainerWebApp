import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { DialogOverlay } from "@radix-ui/react-dialog";
import { createContext, useState, useContext, ReactNode, useCallback, useEffect } from "react";

export type DialogOptions = {
  title: string;
  description?: string;
  blurBackground?: boolean;
  actionLabel?: string;
  actionVariant?: "default" | "destructive" | "outline" | null | undefined;
  cancelLabel?: string;
  onConfirm?: () => void;
  onCancel?: () => void;
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
    const defaultOptions: Partial<DialogOptions> = {
      blurBackground: false,
      actionVariant: "default",
      cancelLabel: "Cancel",
      actionLabel: "Confirm",
    };
    setDialog({ ...defaultOptions, ...options });
    setIsOpen(true);
  }, []);

  const handleConfirm = () => {
    dialog?.onConfirm?.();
    setIsOpen(false);
  };

  const handleCancel = () => {
    dialog?.onCancel?.();
    setIsOpen(false);
  };

  return (
    <DialogContext.Provider value={{ showDialog }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {dialog?.blurBackground && <DialogOverlay className="fixed inset-0 bg-white/60 backdrop-blur-xl" />}
        <DialogContent onEscapeKeyDown={(e) => {
          e.stopPropagation();
          handleCancel();
        }} onPointerDownOutside={handleCancel}>
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