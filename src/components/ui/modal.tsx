import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from './dialog';
import { X } from 'lucide-react';
import { Button } from './button';

export const Modal = Dialog;
export const ModalContent = DialogContent;
export const ModalDescription = DialogDescription;
export const ModalFooter = DialogFooter;
export const ModalHeader = DialogHeader;
export const ModalTitle = DialogTitle;

interface ModalCloseProps {
  onClick: () => void;
}

export function ModalClose({ onClick }: ModalCloseProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
      onClick={onClick}
    >
      <X className="h-4 w-4" />
      <span className="sr-only">Close</span>
    </Button>
  );
}