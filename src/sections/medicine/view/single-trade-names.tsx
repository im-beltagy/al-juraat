'use client';

import { Avatar, TextField } from '@mui/material';
import { Box, Stack, Container } from '@mui/system';

import { useTranslate } from 'src/locales';

import { RHFUploadAvatar } from 'src/components/hook-form';
import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { TradeNames } from 'src/types/medicine';

interface Props {
  tradeName: TradeNames;
}
export default function SingleTradeNameView({ tradeName }: Props) {
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
      <CustomBreadcrumbs heading={t('Trade Name')} links={[{}]} sx={{ mb: 3 }} />

      <Stack spacing={3} maxWidth="20rem">
        <Box sx={{ mb: 5 }}>
          <Avatar
            src={tradeName.imageUrl}
            sx={(theme) => ({
              width: 150,
              height: 150,
              mx: 'auto',
              border: '.5rem solid white',
              outline: `1px dashed ${theme.palette.divider}`,
            })}
          />
        </Box>

        <TextField
          name="name"
          label={t('Name')}
          placeholder={t('Name')}
          value={tradeName.name}
          inputProps={{ readOnly: true }}
        />

        <TextField
          rows={5}
          name="description"
          multiline
          label={t('Description')}
          placeholder={t('Description')}
          value={tradeName.description}
          inputProps={{ readOnly: true }}
        />
      </Stack>
    </Container>
  );
}
