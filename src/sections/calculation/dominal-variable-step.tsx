'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Slider, Button, FormLabel, TextField, FormHelperText } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFRadioGroup } from 'src/components/hook-form';
import CustomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { requiredYupItem } from 'src/types/autoComplete';
import { IDosageItem, IVariableItem, yupCalculationItem } from 'src/types/calculations';

import { useCalculationStore } from './calculation-store';

const EFFECT_TYPES = ['Positive', 'Negative'];

export interface Props {
  variables: IVariableItem[];
  initialDosage?: IDosageItem;
}

export default function DominalVariableStep({ variables, initialDosage }: Props) {
  const { t } = useTranslate();

  const { medicine, formula, indication, variable, setVariable, allVariables } =
    useCalculationStore((state) => ({
      medicine: state.medicine,
      formula: state.formula,
      indication: state.indication,
      variable: state.variable,
      setVariable: state.setVariable,
      allVariables: state.allVariables,
    }));

  const searchParams = useSearchParams();
  const currentVariable = variables.find(({ id }) => id === searchParams.get('variable'));

  useEffect(() => {
    if (currentVariable) setVariable(currentVariable);
    console.log(currentVariable);
  }, [currentVariable, setVariable]);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        variable: yupCalculationItem,
        variable_value:
          variable?.type === 'range'
            ? yup
                .array(yup.number().required(t('Value is required')))
                .required(t('Value is required'))
                .nullable()
            : requiredYupItem(t('Value is required')).nullable(),
        effect: yup.number().required(t('Effect is required')),
        effect_type: yup.string().required(t('Effect type is required')),
      })
    ),
    defaultValues: {
      variable: currentVariable || variables.find(({ id }) => id === variable?.id),
    },
  });

  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
    setError,
  } = methods;

  // Handle Range Variable Value
  const [variableValue, setVariableValue] = useState<
    number[] | { name: string; id: string } | null
  >([0, 0]);
  const handleChangeVariableValue = (event: Event, newValue: number | number[] | ITems) => {
    if (typeof newValue === 'number') {
      setVariableValue([newValue, newValue]);
    } else if (Array.isArray(newValue)) {
      setVariableValue([newValue[0], newValue[1]]);
      setValue('variable_value', [newValue[0], newValue[1]]);
    }
  };

  // Effect Result
  const [result, setResult] = useState<number | null>(null);
  const effect = watch('effect');
  const effectType = watch('effect_type');
  const calculate = useCallback(() => {
    let val: number;
    if (effectType === 'positive') {
      val = Number(initialDosage?.value) * (1 + Number(effect) / 100);
    } else {
      val = Number(initialDosage?.value) * (1 - Number(effect) / 100);
    }
    setResult(Math.round(val));
  }, [initialDosage?.value, effect, effectType]);

  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = useCallback(
    (data: any) => {
      if (data.variable_value === null) {
        setError('variable_value', {
          message: t('Value is required'),
        });
        return;
      }

      setIsLoading(true);

      const dataBody = {
        medicine: medicine?.id,
        formula: formula?.id,
        indication: indication?.id,
        variable: data.variable?.id,
        variable_value: data.variable_value.id || data.variable_value,
        effect: data.effect,
        effect_type: data.effect_type,
      };

      try {
        enqueueSnackbar(t('Successfully saved'), { variant: 'success' });
      } catch (error) {
        enqueueSnackbar(t('Failed to save'), { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    },
    [formula?.id, indication?.id, medicine?.id, setError, t]
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          {/* Static Details */}
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="medicine"
              label={t('Scientific name')}
              value={medicine?.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField name="formula" label={t('Formula')} value={formula?.name} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="indication"
              label={t('Indication')}
              value={indication?.name}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="dosage"
              label={t('Dosage')}
              type="number"
              value={initialDosage?.value}
              InputProps={{ endAdornment: initialDosage?.unit }}
              disabled
            />
          </Grid>

          {/* Set Variable And Value */}
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="variable"
              label={t('Variable')}
              placeholder={t('Variable')}
              isDisabled={!!currentVariable}
              items={(
                (currentVariable ? [currentVariable] : allVariables || []) as IVariableItem[]
              ).map((item) => ({ ...item, name_ar: item.name, name_en: item.name }) as ITems)}
              onCustomChange={(item) => {
                if (item) {
                  const { name, id, type, options } = item;
                  setVariable({ name, id, type, options });
                } else {
                  setVariable();
                }
                setVariableValue(null);
                setValue('variable_value', null);
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ alignSelf: 'center' }}>
            {variable?.type === 'range' ? (
              <>
                <FormLabel>{t('Value')}</FormLabel>
                <Slider
                  step={2}
                  value={Array.isArray(variableValue) ? variableValue : [0, 0]}
                  onChange={handleChangeVariableValue}
                  valueLabelDisplay="auto"
                />
              </>
            ) : null}
            {variable?.type === 'list' ? (
              <CustomAutocompleteView
                name="variable_value"
                label={t('Value')}
                placeholder={t('Value')}
                items={
                  (variable?.options?.map((item) => ({
                    ...item,
                    name_ar: item.name,
                    name_en: item.name,
                  })) || []) as ITems[]
                }
                onCustomChange={(item) => {
                  if (item) {
                    const { name, id } = item;
                    setVariableValue({ name, id });
                  } else {
                    setVariableValue(null);
                  }
                }}
              />
            ) : (
              <>
                {typeof errors.variable_value?.message === 'string' ? (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.variable_value?.message}
                  </FormHelperText>
                ) : null}
              </>
            )}
          </Grid>

          {/* Set Effect */}
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="effect"
              label={t('Effect')}
              type="number"
              InputProps={{ endAdornment: '%' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFRadioGroup
              name="effect_type"
              label={t('Effect type')}
              options={EFFECT_TYPES.map((item) => ({
                label: t(item),
                value: item.toLocaleLowerCase(),
              }))}
              row
            />
          </Grid>

          {/* Effect Result */}
          <Grid item xs={12} sm={6} sx={{ alignSelf: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              disabled={!(effect && effectType)}
              onClick={() => calculate()}
            >
              {t('Calculate')}
            </Button>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormLabel>{t('Result')}</FormLabel>
            <TextField
              placeholder={t('New Dosage')}
              value={result}
              InputProps={{ readOnly: true, hiddenLabel: true }}
              size="small"
              fullWidth
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isLoading}>
              {t(currentVariable ? 'Edit' : 'Save')}
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
      <Box />
    </>
  );
}
