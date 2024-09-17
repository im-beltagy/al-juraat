'use client';

import { Box, Container } from '@mui/material';

import { useSettingsContext } from 'src/components/settings';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IVariable } from 'src/types/variables';

import { VariablesList } from '../variables-list';
import { VariablesNewForm } from '../variables-new-form';

interface Props {
  variables: IVariable[];
  count: number;
}

export default function VariablesView({ variables, count }: Props) {
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
      <CustomBreadcrumbs heading="Variables" links={[{}]} sx={{ mb: 3 }} />

      <VariablesNewForm />
      <Box mb={5} />
      <VariablesList variables={variables} count={count} />
    </Container>
  );
}
