'use client';

import { useSnackbar } from 'notistack';
import { useMemo, useState, useCallback } from 'react';

import { Stack, Container } from '@mui/system';
import { GridExpandMoreIcon } from '@mui/x-data-grid';
import {
  Card,
  Button,
  Accordion,
  AccordionDetails,
  AccordionSummary,
  AccordionActions,
} from '@mui/material';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { ConfirmDialog } from 'src/components/custom-dialog';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { FAQItem } from 'src/types/faq';

import EditFaqDialog from '../edit-faq-dialog';
import NewEditFaqForm from '../new-edit-faq-form';

interface Props {
  items: FAQItem[];
}

export default function FAQView({ items }: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const { enqueueSnackbar } = useSnackbar();

  const [deleteItemId, setDeleteItemId] = useState('');
  const [editItemId, setEditItemId] = useState('');
  const editItem = useMemo(
    () => items.find((item) => item.id === editItemId) || null,
    [items, editItemId]
  );

  const [expanded, setExpanded] = useState<string | false>(items[0]?.id || false);

  const handleChangeExpanded = useCallback(
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false);
    },
    []
  );

  const handleConfirmDelete = useCallback(() => {
    try {
      enqueueSnackbar('Deleted Successfully', { variant: 'success' });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Faild to delete', { variant: 'error' });
    } finally {
      setDeleteItemId('');
    }
  }, [enqueueSnackbar]);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('FAQs')} links={[{}]} sx={{ mb: 3 }} />

      <NewEditFaqForm row />

      <Stack spacing={1} mt={3}>
        {items.map((item) => (
          <Card key={item.id}>
            <Accordion expanded={expanded === item.id} onChange={handleChangeExpanded(item.id)}>
              <AccordionSummary
                expandIcon={<GridExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
              >
                {item.question}
              </AccordionSummary>
              <AccordionDetails>{item.answer}</AccordionDetails>
              {/* Actions */}
              <AccordionActions>
                <Button variant="contained" color="error" onClick={() => setDeleteItemId(item.id)}>
                  {t('Delete')}
                </Button>
                <Button variant="contained" color="primary" onClick={() => setEditItemId(item.id)}>
                  {t('Edit')}
                </Button>
              </AccordionActions>
            </Accordion>
          </Card>
        ))}
      </Stack>

      {deleteItemId && (
        <ConfirmDialog
          open={!!deleteItemId}
          onClose={() => setDeleteItemId('')}
          title={t('Delete')}
          content={t('delete_confirm')}
          handleConfirmDelete={handleConfirmDelete}
        />
      )}

      {editItem ? (
        <EditFaqDialog open={!!editItemId} onClose={() => setEditItemId('')} item={editItem} />
      ) : null}
    </Container>
  );
}
