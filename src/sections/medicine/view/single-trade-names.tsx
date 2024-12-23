'use client';

import { TextField } from '@mui/material';
import { Box, Stack, Container } from '@mui/system';

import { useTranslate } from 'src/locales';

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
        {tradeName?.tradeNamesImages?.map((image,index)=> (


      <Stack
            key={index}
            component="div"
            spacing={2}
            direction="column"
            alignItems="center"
            sx={{
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
            }}
          >
        <Box
        component="img"
        src={image?.imageUrl}
        sx={{
          width: 200,
          height: 200,
          flexShrink: 0,
        }}
      />
          </Stack>
        ))}

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
