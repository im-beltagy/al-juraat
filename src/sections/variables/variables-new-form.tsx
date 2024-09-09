'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import { Grid, Typography } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';

import { paths } from 'src/routes/paths';

import { useQueryString } from 'src/hooks/use-queryString';

import { invalidatePath } from 'src/actions/cache-invalidation';

import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';
import { MultiValuesTextField } from 'src/components/hook-form/multi-values-text-field';
import CustomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

const VARIABLE_TYPES = [
  { label: 'Range', value: 'range' },
  { label: 'List', value: 'list' },
];

export function VariablesNewForm() {
  const { createQueryString } = useQueryString();
  const searchParams = useSearchParams();
  const variableType = searchParams.get('type');

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required('Name is required'),
        type: yup
          .object()
          .shape({
            id: yup.string().required('Type is required'),
            name: yup.string().required('Type is required'),
            name_ar: yup.string().required('Type is required'),
            name_en: yup.string().required('Type is required'),
          })
          .required('Type is required'),

        ...(variableType === 'range'
          ? { max_value: yup.number().required('Max value is required') }
          : {
              value: yup
                .array(yup.string().required('Value is required'))
                .min(1, 'Value is required')
                .required('Value is required'),
            }),
      })
    ),
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    invalidatePath(paths.dashboard.root);
  });

  const renderValueInput = (type: string | null) => {
    switch (type) {
      case 'range':
        return (
          <RHFTextField
            name="max_value"
            label="Max Value"
            placeholder="Max Value"
            type="number"
            helperText=" "
          />
        );

      case 'list':
        return (
          <MultiValuesTextField name="value" label="Value" placeholder="Value" helperText=" " />
        );
      default:
        return (
          <RHFTextField name="none" label="Value" placeholder="Value" helperText=" " disabled />
        );
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={onSubmit}>
      <Grid container spacing={1}>
        <Grid item xs={6} md={3}>
          <Typography variant="h5">New Variable:</Typography>
        </Grid>
        <Grid item xs={6} md={3}>
          <RHFTextField name="name" label="Name" placeholder="Name" />
        </Grid>
        <Grid item xs={6} md={3}>
          <CustomAutocompleteView
            name="type"
            label="Type"
            placeholder="Type"
            items={VARIABLE_TYPES.map((item) => ({
              id: item.value,
              name: item.label,
              name_ar: item.label,
              name_en: item.label,
            }))}
            onCustomChange={(item: ITems) => {
              createQueryString([{ name: 'type', value: item?.id }], true);
            }}
          />
        </Grid>
        <Grid item xs={6} md={3}>
          {renderValueInput(variableType)}

          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            loading={isSubmitting}
            fullWidth
            sx={{
              display: 'block',
              width: 'fit-content',
              marginInlineStart: 'auto',
            }}
          >
            Add
          </LoadingButton>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
