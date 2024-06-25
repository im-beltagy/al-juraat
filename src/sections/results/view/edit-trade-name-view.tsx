'use client';

import { Container } from '@mui/system';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { TradeName } from 'src/types/results';

import NewEditTradeNameForm from '../new-edit-trade-name-form';

interface Props {
  tradeName: TradeName;
}

export default function EditTradeNameView({ tradeName }: Props) {
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
      <CustomBreadcrumbs heading={t('Edit Trade Name')} links={[{}]} sx={{ mb: 3 }} />

      <NewEditTradeNameForm tradeName={tradeName} />
    </Container>
  );
}
