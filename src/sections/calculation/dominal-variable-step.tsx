'use client';

import * as yup from 'yup';
import { useSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import {
  Box,
  Grid,
  Slider,
  Button,
  FormLabel,
  TextField,
  FormHelperText,
  InputAdornment,
} from '@mui/material';

import { useQueryString } from 'src/hooks/use-queryString';

import { getErrorMessage } from 'src/utils/axios';

import { useTranslate } from 'src/locales';
import { fetchSingleVariable } from 'src/actions/variables-actions';
import {
  createEquation,
  addDominalVariables,
  editDominalVariables,
} from 'src/actions/equation-actions';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFRadioGroup, RHFAutocomplete } from 'src/components/hook-form';

import { IDosageItem } from 'src/types/calculations';

import { useCalculationStore } from './calculation-store';

const EFFECT_TYPES = ['Positive', 'Negative', 'No effect'];
export interface Props {
  initialDosage?: IDosageItem;
}

export default function DominalVariableStep({ initialDosage }: Props) {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString();
  const { enqueueSnackbar } = useSnackbar();

  const {
    medicine,
    formula,
    indication,
    variable,
    setVariable,
    equationVariable,
    allVariables,
    setAllVariables,
    initialDosage: storeDosage,
  } = useCalculationStore();

  useEffect(() => {
    if (!searchParams.get('formula')) {
      createQueryString([{ name: 'formula', value: String(formula?.id) }]);
    }
    if (!searchParams.get('indication')) {
      createQueryString([{ name: 'indication', value: String(indication?.id) }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formula, indication]);

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        variable: yup.object().required('Variable is required'),
        variable_value:
          variable?.type === 'Range'
            ? yup
                .array(yup.number().required(t('Value is required')))
                .required(t('Value is required'))
            : yup.string(),
        effect: yup.number().required(t('Effect is required')),
        effect_type: yup.string().required(t('Effect type is required')),
        noEffect: yup.mixed().nullable(),
      })
    ),
  });

  const {
    setValue,
    watch,
    getValues,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = methods;

  // Handle Range Variable Value
  const [variableValue, setVariableValue] = useState<number[] | string | null>([
    equationVariable?.minValue || 0,
    equationVariable?.maxValue || 0,
  ]);
  const handleChangeVariableValue = (
    _event: Event | null,
    newValue: number | number[] | string
  ) => {
    if (typeof newValue === 'number') {
      setVariableValue([newValue, newValue]);
    } else if (Array.isArray(newValue)) {
      setVariableValue([newValue[0], newValue[1]]);
      setValue('variable_value', [newValue[0], newValue[1]]);
    } else {
      setVariableValue(newValue);
      setValue('variable_value', newValue);
    }
  };

  useEffect(() => {
    (async function fetchVariable() {
      if (equationVariable?.variableId) {
        try {
          const res = await fetchSingleVariable(equationVariable?.variableId);
          setVariable(res);
          setAllVariables([res]);
          setValue('variable', res);
          handleChangeVariableValue(
            null,
            res.type === 'Range'
              ? [equationVariable?.minValue, equationVariable?.maxValue]
              : equationVariable.value
          );
          setValue('effect', equationVariable.effect);
          setValue(
            'effect_type',
            EFFECT_TYPES[
              // eslint-disable-next-line no-nested-ternary
              equationVariable.noEffect ? 2 : equationVariable.effectType ? 0 : 1
            ].toLocaleLowerCase()
          );
        } catch (error) {
          enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [equationVariable]);

  // Effect Result
  const [result, setResult] = useState<number | null>(null);
  const effect = watch('effect');
  const effectType = watch('effect_type');
  const [addVariable, setAddVariable] = useState(false);
  const calculate = useCallback(() => {
    let val: number;
    if (effectType === 'positive') {
      val = Number(initialDosage?.dosage) * (1 + Number(effect) / 100);
    } else {
      val = Number(initialDosage?.dosage) * (1 - Number(effect) / 100);
    }
    setResult(Math.round(val));
  }, [initialDosage?.dosage, effect, effectType]);

  const submitAdd = useCallback(
    async (data: any) => {
      if (['positive', 'negative'].includes(data.effect_type) && !data.effect) {
        setError('effect', { message: t('Effect is required') });
        return;
      }
      const dataRange = {
        variableId: data?.variable?.id,
        minValue: data?.variable_value?.[0],
        maxValue: data?.variable_value?.[1],
        effect: data?.effect_type === 'no effect' ? null : data?.effect,
        effectType:
          // eslint-disable-next-line no-nested-ternary
          data?.effect_type === 'positive'
            ? true
            : data?.effect_type === 'no effect'
              ? null
              : false,
        noEffect: data?.effect_type === 'no effect' ? true : null,
      };
      const dataList = {
        variableId: data?.variable?.id,
        value: data?.variable_value,
        effect: data?.effect_type === 'no effect' ? null : data?.effect,
        effectType:
          // eslint-disable-next-line no-nested-ternary
          data?.effect_type === 'positive'
            ? true
            : data?.effect_type === 'no effect'
              ? null
              : false,
        noEffect: data?.effect_type === 'no effect' ? true : null,
      };

      const res = await addDominalVariables(
        searchParams.get('equationId') || '',
        data?.variable?.type !== 'Range' ? dataList : dataRange
      );
      if (res?.error) {
        enqueueSnackbar(res.error || `${'Dominal variable already exists this effect!'}`, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar('Added success!', {
          variant: 'success',
        });
      }
    },
    [enqueueSnackbar, searchParams, setError, t]
  );

  const onSubmit = useCallback(
    async (data: any) => {
      if (['positive', 'negative'].includes(data.effect_type) && !data.effect) {
        setError('effect', { message: t('Effect is required') });
        return;
      }
      const dataFormRange = {
        scientificName: medicine?.id,
        formula: formula?.id,
        indication: indication?.id,
        initialDose: initialDosage?.dosage,
        dominalVariables: [
          {
            variableId: data?.variable?.id,
            variableName: data?.variable?.name,
            type: data?.variable?.type,
            minValue: data?.variable_value?.[0],
            maxValue: data?.variable_value?.[1],
            effect: data?.effect_type === 'no effect' ? null : data?.effect,
            effectType:
              // eslint-disable-next-line no-nested-ternary
              data?.effect_type === 'positive'
                ? true
                : data?.effect_type === 'no effect'
                  ? null
                  : false,
            noEffect: data?.effect_type === 'no effect' ? true : null,
          },
        ],
      };
      const dataFormList = {
        scientificName: medicine?.id,
        formula: formula?.id,
        indication: indication?.id,
        initialDose: initialDosage?.dosage,
        dominalVariables: [
          {
            variableId: data?.variable?.id,
            type: data?.variable?.type,
            variableName: data?.variable?.name,
            value: data?.variable_value,
            effect: data?.effect_type === 'no effect' ? null : data?.effect,
            effectType:
              // eslint-disable-next-line no-nested-ternary
              data?.effect_type === 'positive'
                ? true
                : data?.effect_type === 'no effect'
                  ? null
                  : false,
            noEffect: data?.effect_type === 'no effect' ? true : null,
          },
        ],
      };
      if (equationVariable) {
        const dataRange = {
          id: equationVariable?.id,
          variableId: equationVariable?.variableId,
          variableName: data?.variable?.name,
          minValue: data?.variable_value?.[0],
          maxValue: data?.variable_value?.[1],
          effect: data?.effect_type === 'no effect' ? null : data?.effect,
          effectType:
            // eslint-disable-next-line no-nested-ternary
            data?.effect_type === 'positive'
              ? true
              : data?.effect_type === 'no effect'
                ? null
                : false,
          noEffect: data?.effect_type === 'no effect',
        };
        const dataList = {
          id: equationVariable?.id,
          variableId: equationVariable?.variableId,
          variableName: data?.variable?.name,
          value: data?.variable_value,
          effect: data?.effect_type === 'no effect' ? null : data?.effect,
          effectType:
            // eslint-disable-next-line no-nested-ternary
            data?.effect_type === 'positive'
              ? true
              : data?.effect_type === 'no effect'
                ? null
                : false,
          noEffect: data?.effect_type === 'no effect',
        };
        const res = await editDominalVariables(
          data?.variable?.type !== 'Range' ? dataList : dataRange
        );
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Updated success!', {
            variant: 'success',
          });
        }
      } else {
        const res = await createEquation(
          data?.variable?.type !== 'Range' ? dataFormList : dataFormRange
        );
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          createQueryString([{ name: 'equationId', value: String(res?.id) }]);
          enqueueSnackbar('Created success!', {
            variant: 'success',
          });
          if (!searchParams.get('equationId')) {
            createQueryString([{ name: 'equationId', value: String(res?.id) }]);
          }
        }
      }
    },
    [
      createQueryString,
      enqueueSnackbar,
      equationVariable,
      formula?.id,
      indication?.id,
      initialDosage?.dosage,
      medicine?.id,
      searchParams,
      setError,
      t,
    ]
  );
  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(addVariable ? submitAdd : onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="medicine"
              label={t('Scientific name')}
              value={medicine?.value}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField name="formula" label={t('Formula')} value={formula?.value} disabled />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="indication"
              label={t('Indication')}
              value={indication?.value}
              disabled
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="dosage"
              label={t('Dosage')}
              type="tel"
              value={(initialDosage || storeDosage)?.dosage}
              InputProps={{
                endAdornment: (initialDosage || storeDosage)?.isWeightDependent ? (
                  <InputAdornment position="end">mg/kg</InputAdornment>
                ) : (
                  <InputAdornment position="end">mg</InputAdornment>
                ),
              }}
              disabled
            />
          </Grid>

          <Grid item xs={12} sm={6}>
            {equationVariable ? (
              <TextField
                label={t('Variable')}
                placeholder={t('Variable')}
                value={equationVariable.variableName}
                fullWidth
                disabled
              />
            ) : (
              <RHFAutocomplete
                name="variable"
                label={t('Variable')}
                placeholder={t('Variable')}
                options={allVariables || []}
                getOptionLabel={(option: any) => {
                  if (typeof option?.name === 'string') {
                    return option?.name;
                  }
                  return '';
                }}
                onChange={(event, item: any) => {
                  if (item) {
                    setVariable(item);
                    setValue('variable', item);
                  } else {
                    setVariable();
                  }

                  setVariableValue(null);
                  setValue('variable_value', '');
                }}
              />
            )}
          </Grid>

          <Grid item xs={12} sm={6} sx={{ alignSelf: 'center' }}>
            {variable?.type === 'Range'
              ? (() => {
                  const value = Array.isArray(variableValue)
                    ? variableValue
                    : [0, variable.maxValue || 100];
                  return (
                    <>
                      <FormLabel>{`Value (${value.join(', ')})`}</FormLabel>
                      <Slider
                        step={2}
                        value={value}
                        max={variable.maxValue || 100}
                        onChange={handleChangeVariableValue}
                        valueLabelDisplay="auto"
                      />
                    </>
                  );
                })()
              : null}
            {variable?.type === 'List' ? (
              <RHFAutocomplete
                name="variable_value"
                label="Value"
                placeholder="Value"
                options={variable?.values || []}
                onChange={(_event, item: any) => {
                  if (item) {
                    setValue('variable_value', item);
                    setVariableValue(item);
                  } else {
                    setVariableValue(null);
                  }
                }}
                value={equationVariable?.value}
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

          <Grid item xs={12} sm={6}>
            <RHFTextField
              name="effect"
              label={t('Effect')}
              type="number"
              InputProps={{ endAdornment: '%' }}
              defaultValue={equationVariable?.effect}
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
              defaultValue={
                equationVariable
                  ? EFFECT_TYPES[
                      // eslint-disable-next-line no-nested-ternary
                      equationVariable.noEffect ? 2 : equationVariable.effectType ? 0 : 1
                    ].toLocaleLowerCase()
                  : undefined
              }
            />
          </Grid>

          <Grid item xs={12} sm={6} sx={{ alignSelf: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              disabled={
                !(effect && effectType) || Boolean(getValues('effect_type') === 'no effect')
              }
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

          <Grid item xs={12} sx={{ gap: 1, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {t(searchParams.get('variableId') ? 'Edit' : 'Save')}
            </LoadingButton>
            <LoadingButton
              onClick={() => setAddVariable(true)}
              disabled={!searchParams.get('equationId') || !!equationVariable}
              type="submit"
              variant="contained"
              color="primary"
              loading={isSubmitting}
            >
              Add
            </LoadingButton>
          </Grid>
        </Grid>
      </FormProvider>
      <Box />
    </>
  );
}
