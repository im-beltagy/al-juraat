'use client';

import { Box, Stack, Container } from '@mui/system';

import { useTranslate } from 'src/locales';

import { useState, useCallback } from 'react';
import { t } from 'i18next';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import TableRow from '@mui/material/TableRow';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';

import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';
import { Medicine } from 'src/types/medicine';
import { Avatar } from '@mui/material';

interface Props {
  medicine: Medicine;
}
export default function SingleMedicineView({ medicine }: Props) {
  const { t } = useTranslate();


  const renderList = (
    <TableContainer sx={{ overflow: 'unset', mt: 5 }}>
      <Scrollbar>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell sx={{ typography: 'subtitle2' }}> Name</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {medicine?.tradNames?.map((item)=> (

            <TableRow key={item?.id}>

              <TableCell>
                <Avatar src={`${item?.imageUrl}`} />
              </TableCell>

              <TableCell>{item?.name}</TableCell>

              <TableCell >{item?.description}</TableCell>
            </TableRow>
            ))}
          </TableBody>
        </Table>
      </Scrollbar>
    </TableContainer>
  );
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
      <CustomBreadcrumbs heading={medicine?.scientificName || t('Medicine ')} links={[{}]} sx={{ mb: 3 }} />

      <Stack spacing={3} >
      <Card sx={{ p:5 }}>
        <Box
          rowGap={5}
          display="grid"
          alignItems="center"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
          }}
        >
          <Box
            component="img"
            alt="logo"
            src="/logo/logo_single.svg"
            sx={{ width: 48, height: 48 }}
          />

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

        {medicine?.tradNames[0] &&
         <>
          <Stack >
            <Typography variant="h6" sx={{ mt: 3 }}>
            Trade Names
            </Typography>
          </Stack>
        {renderList}
        </>}

      </Card>
      </Stack>
    </Container>
  );
}

// ----------------------------------------------------------------------

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '& td': {
    textAlign: 'right',
    borderBottom: 'none',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
}));

// ----------------------------------------------------------------------
/* {
  "id": "c73ec8c5-646b-4187-833c-b75cfa10561e",
  "scientificName": "Aspirin",
  "formula": "C9H8O4",
  "indication": "pain, fever, inflammation.",
  "initialDose": 500,
  "pharmacologicalGroup": "Nonsteroidal anti-inflammatory drug (NSAID)",
  "notes": "Commonly used for headaches and muscle aches.",
  "preCautions": "\"Not recommended for children with viral infections due to risk of Reye's syndrome.",
  "sideEffects": "May cause gastrointestinal bleeding, allergic reactions, and stomach upset.",
  "tradNames": [
    {
      "id": "59896d5a-4041-448d-a342-56707b944304",
      "imageUrl": "https://api.medicaldosages.com/uploads/medicines/e9b5fc671ded4e73822de91fd5daf7a9.jfif",
      "name": "actavis",
      "description": "actavis"
    }
  ]
} */

