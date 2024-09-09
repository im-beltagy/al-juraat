import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import { ConfirmDialogProps } from './types';
import CloseButton from '../dialog/CloseButton';

// ----------------------------------------------------------------------

export default function ConfirmDialog({
  title,
  content,
  buttonTitle,
  buttonColor,
  action,
  open,
  onClose,
  handleConfirmDelete,
  ...other
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <CloseButton onClose={onClose} />
      <DialogTitle sx={{ pb: 0.5 }}>{title || t('Delete')}</DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ py: 1 }}>
          {content ? (
            <Typography variant="body1"> {content} </Typography>
          ) : (
            <Typography variant="body1" color="disabled">
              {t('delete_confirm')}
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button
          variant="contained"
          color={buttonColor || 'error'}
          onClick={handleConfirmDelete}
          sx={{ color: buttonColor === 'warning' ? 'white' : undefined }}
        >
          {typeof buttonTitle === 'string' ? buttonTitle : t('Delete')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
