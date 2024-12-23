'use client';

import * as yup from 'yup';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { yupResolver } from '@hookform/resolvers/yup';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Grid,
  Button,
  Dialog,
  Select,
  MenuItem,
  DialogTitle,
  DialogContent,
} from '@mui/material';

import { editVariable } from 'src/actions/variables-actions';

import CloseButton from 'src/components/dialog/CloseButton';
import FormProvider from 'src/components/hook-form/form-provider';
import RHFTextField from 'src/components/hook-form/rhf-text-field-form';
import { MultiValuesTextField } from 'src/components/hook-form/multi-values-text-field';

import { IVariable } from 'src/types/variables';

type Props = {
  open: boolean;
  onClose: () => void;
  variable: any;
};
export function VariablesEditForm({ variable, open, onClose }: Props) {
  const variableSchema = yup.object({
    id: yup.string(),
    name: yup.string().required('name is required!'),
    type: yup.string().required('name is required!'),
    values: yup.array(),
    maxValue: yup.number(),
  });
  const defaultValues: IVariable = {
    name: variable.name || '',
    type: variable.type || '',
    values: variable.values || [],
    maxValue: variable.maxValue || 0,
    id: variable.id || '',
  };

  const methods = useForm({
    resolver: yupResolver(variableSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    getValues,
    watch,
    setValue,
    reset,
    formState: { isSubmitting, errors },
  } = methods;
  const watching = watch();
  useEffect(() => {
    if (getValues('type') === 'Range') {
      setValue('values', []);
      setValue('maxValue', variable.maxValue);
    } else {
      setValue('maxValue', 0);
      setValue('values', variable.values || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watching.type]);
  useEffect(() => {
    reset({
      name: variable.name,
      type: variable.type,
      values: variable.values,
      maxValue: variable.maxValue,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variable, open]);

  const onSubmit = handleSubmit(async (data: any) => {
    const id = variable.id || getValues('id');
    const dataForm = {
      name: getValues('name'),
      type: getValues('type'),
      maxValue: getValues('type') === 'Range' ? getValues('maxValue') || variable.maxValue : null,
      values: getValues('type') === 'List' ? getValues('values') || variable.values : null,
    };

    const res = await editVariable(id, dataForm);
    if (res?.error) {
      enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
    } else {
      enqueueSnackbar('Updated success!', {
        variant: 'success',
      });
      onClose();
    }
    console.log(errors);
    //  invalidatePath(paths.dashboard.root);
  });

  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <FormProvider methods={methods} onSubmit={onSubmit}>
        <CloseButton onClose={onClose} />
        <DialogTitle sx={{ pb: 1, textAlign: 'center' }}>Edit</DialogTitle>
        <DialogContent
          sx={{
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Grid container spacing={1} sx={{ mt: 3 }}>
            <Grid item xs={12}>
              <RHFTextField
                required={getValues('name') !== ''}
                onChange={(e) => setValue('name', e.target.value)}
                value={getValues('name')}
                name="name"
                label="Name"
                placeholder="Name"
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                name="type"
                label="Type"
                fullWidth
                onChange={(e) => setValue('type', e.target.value)}
                value={getValues('type')}
                placeholder="Type"
              >
                <MenuItem value="Range">Range</MenuItem>
                <MenuItem value="List">List</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <RHFTextField
                name="maxValue"
                label="Max Value"
                placeholder="Max Value"
                type="number"
                required={getValues('type') === 'Range'}
                disabled={getValues('type') === 'List'}
              />
            </Grid>
            <Grid item xs={12}>
              <MultiValuesTextField
                required={getValues('type') === 'List' && !getValues('values')}
                disabled={getValues('type') === 'Range'}
                name="values"
                label="Values"
                placeholder="Values"
                helperText=" "
              />
            </Grid>
          </Grid>
        </DialogContent>
        <Box
          sx={{
            m: 3,
            display: 'grid',
            gap: 3,
            gridTemplateColumns: { md: 'repeat(2, 1fr)', xs: 'repeat(1, 1fr)' },
          }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={isSubmitting}
            sx={{
              mr: 0,

              marginRight: 0,
            }}
          >
            Save
          </LoadingButton>

          <Button variant="outlined" color="inherit" onClick={onClose}>
            Close
          </Button>
        </Box>
      </FormProvider>
    </Dialog>
  );
}
