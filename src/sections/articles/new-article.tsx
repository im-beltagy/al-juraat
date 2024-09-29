'use client';

import { Container } from '@mui/system';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import NewEditTradeNameForm from './new-edit-trade-name-form';

export default function NewArticleView() {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t('Create New Article')} links={[{}]} sx={{ mb: 3 }} />

      <NewEditTradeNameForm />
    </Container>
  );
}
