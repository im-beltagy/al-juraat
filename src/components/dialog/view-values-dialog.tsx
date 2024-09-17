import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import { Box, Typography } from '@mui/material';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';

import CloseButton from './CloseButton';
import { ConfirmDialogProps } from './types';

// ----------------------------------------------------------------------

export default function ViewValuesDialog({
  title,
  content,
  buttonTitle,
  buttonColor,
  action,
  open,
  onClose,
  handleClose,
  ...other
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose} {...other}>
      <CloseButton onClose={onClose} />
      <DialogTitle sx={{ pb: 0.5 }}>{title || t('View')}</DialogTitle>

      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Box sx={{ py: 1 }}>
         {
          content?.map((item, index)=> (

            <Typography key={index} variant="body1"> {item} </Typography>
          ))
         }

        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          {t('Close')}
        </Button>
       {/*  <Button
          variant="contained"
          color={buttonColor || 'error'}
          onClick={handleClose}
          sx={{ color: buttonColor === 'warning' ? 'white' : undefined }}
        >
          {typeof buttonTitle === 'string' ? buttonTitle : t('Close')}
        </Button> */}
      </DialogActions>
    </Dialog>
  );
}
