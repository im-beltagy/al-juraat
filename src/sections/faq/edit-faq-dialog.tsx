'use client';

import { Box, Dialog, DialogTitle } from '@mui/material';

import { useTranslate } from 'src/locales';

import { FAQItem } from 'src/types/faq';

import NewEditFaqForm from './new-edit-faq-form';

interface Props {
  open: boolean;
  onClose: () => void;
  item: FAQItem;
}
export default function EditFaqDialog({ open, onClose, item }: Props) {
  const { t } = useTranslate();

  return (
    <Dialog fullWidth maxWidth="lg" open={open} onClose={() => onClose()}>
      <DialogTitle sx={{ pb: 0 }}>{t('Edit FAQ')}</DialogTitle>

      <Box p={3}>
        <NewEditFaqForm item={item} onClose={onClose} />
      </Box>
    </Dialog>
  );
}
