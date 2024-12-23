'use client';

import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import { Box, Stack, Container } from '@mui/system';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { Medicine } from 'src/types/medicine';

interface Props {
  medicine: Medicine;
}
export default function SingleMedicineView({ medicine }: Props) {
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
      <CustomBreadcrumbs
        heading={medicine?.scientificName || t('Medicine ')}
        links={[{}]}
        sx={{ mb: 3 }}
      />

      <Stack spacing={3}>
        <Card sx={{ p: 5 }}>
          <Box
            rowGap={5}
            display="grid"
            alignItems="center"
            gridTemplateColumns={{
              xs: 'repeat(1, 1fr)',
              sm: 'repeat(2, 1fr)',
            }}
          >
            <Stack>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Medicine Details
              </Typography>
            </Stack>

            <Stack spacing={1} alignItems={{ xs: 'flex-start', md: 'flex-end' }}>
              {/*   <Label
              variant="soft"
              color={
                'success'
              }
            >
              Paid
            </Label>

            <Typography variant="h6">INV-1704</Typography> */}
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Scientific Name
              </Typography>
              {medicine?.scientificName || '- - -'}
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                formula
              </Typography>
              {medicine?.formula || '- - -'}
              <br />
              <br />
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Indication
              </Typography>
              {medicine?.indication || '- - -'}
            </Stack>

            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Pharmacological Group
              </Typography>
              {medicine?.pharmacologicalGroup || '- - -'}
            </Stack>
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Pre Cautions
              </Typography>
              {medicine?.preCautions || '- - -'}
            </Stack>
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Side Effects
              </Typography>
              {medicine?.sideEffects || '- - -'}
            </Stack>
            <Stack sx={{ typography: 'body2' }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                Notes
              </Typography>
              {medicine?.notes || '- - -'}
            </Stack>
          </Box>
        </Card>
      </Stack>
    </Container>
  );
}
