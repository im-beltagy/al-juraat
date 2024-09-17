import { DialogProps } from '@mui/material/Dialog';

// ----------------------------------------------------------------------

export type ConfirmDialogProps = Omit<DialogProps, 'title' | 'content'> & {
  title: React.ReactNode;
  buttonTitle?: string;
  buttonColor?: 'inherit' | 'primary' | 'secondary' | 'info' | 'error' | 'warning';
  content: string[];
  action?: React.ReactNode;
  onClose: VoidFunction;
  handleClose?: VoidFunction;
};
