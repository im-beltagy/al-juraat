'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { enqueueSnackbar } from 'notistack';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';
import { useState, useEffect, useCallback } from 'react';

import LoadingButton from '@mui/lab/LoadingButton';
import { Box, Grid, Slider, Button, FormLabel, TextField, FormHelperText, InputAdornment } from '@mui/material';

import { useTranslate } from 'src/locales';

import FormProvider from 'src/components/hook-form/form-provider';
import { RHFTextField, RHFRadioGroup, RHFAutocomplete } from 'src/components/hook-form';
import CustomAutocompleteView from 'src/components/AutoComplete/CutomAutocompleteView';

import { requiredYupItem } from 'src/types/autoComplete';
import { IDosageItem, IVariableItem, yupCalculationItem } from 'src/types/calculations';
import { useCalculationStore } from './calculation-store';
import { IVariable } from 'src/types/variables';
import { useQueryString } from 'src/hooks/use-queryString';
import { addDominalVariables, createEquation, editDominalVariables } from 'src/actions/equation-actions';
import { IDominalVariables } from 'src/types/results';
import axiosInstance, { endpoints } from 'src/utils/axios';
import { getCookie } from 'cookies-next';

const EFFECT_TYPES = ['Positive', 'Negative'];
type ITems = {
  id:string,
  value:string
}
export interface Props {
  variables: IVariable[];
  initialDosage?: IDosageItem;
  medicineIsWeight:boolean;
}

export default function DominalVariableStep({ variables, initialDosage,medicineIsWeight }: Props) {
  const { t } = useTranslate();
  const searchParams = useSearchParams();
  const { createQueryString } = useQueryString();

  const getSelectedMedicine = JSON.parse(sessionStorage.getItem('medicine') as string);
  const getSelectedFormula = JSON.parse(sessionStorage.getItem('formula') as string);
  const getSelectedIndication = JSON.parse(sessionStorage.getItem('indication') as string);
  const getSelectedVariables = JSON.parse(sessionStorage.getItem('selectedVariables') as string);
  const getVariable= JSON.parse(sessionStorage.getItem('variable') as string);

  const { medicine, formula, indication, variable, setVariable, allVariables } =
    useCalculationStore((state) => ({
      medicine: state.medicine || {id:getSelectedMedicine?.id, value:getSelectedMedicine?.value},
      formula: state.formula|| {id:getSelectedFormula?.id, value:getSelectedFormula?.value} ,
      indication: state.indication|| {id:getSelectedIndication?.id, value:getSelectedIndication?.value} ,
      variable: state.variable,
      setVariable: state.setVariable,
      allVariables: state.allVariables || getSelectedVariables,
    }));
  const currentVariable = getVariable?.dominalVariables?.
  find((item:IDominalVariables)=> item?.variableId === searchParams.get('variableId'));
  useEffect(() => {
    if (!searchParams.get('formula')) {
      createQueryString([{ name: 'formula', value: String(getSelectedFormula?.id)  }]);

    }
    if(!searchParams.get('indication')){
      createQueryString([{ name: 'indication', value: String(getSelectedIndication?.id)  }]);

    }
  }, [getSelectedFormula, getSelectedIndication]);


  const methods = useForm({
    resolver: yupResolver(

      yup.object().shape({
        variable: yup.object().required('Variable is required'),
        variable_value:
          variable?.type === 'Range'
            ? yup
                .array(yup.number().required(t('Value is required')))
                .required(t('Value is required'))

            : yup.object({id:yup.string(), value:yup.string()}),
        effect: yup.number().required(t('Effect is required')),
        effect_type: yup.string().required(t('Effect type is required')),
      })
    ),
    defaultValues: {
      variable: currentVariable  || '',
    },
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
  const [variableValue, setVariableValue] = useState<
    number[] | { value: string; id: string } | null
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

  const [isLoading, setIsLoading] = useState(false);

  const submitAdd =useCallback(
    async (data: any) => {

        const dataRange ={
          "variableId": data?.variable?.id,
          "minValue":  data?.variable_value?.[0] ,
            "maxValue":   data?.variable_value?.[1] ,
            "effect": data?.effect,
            "effectType": data?.effect_type == 'positive'?  true: false

        }
        const dataList = {
          "variableId": data?.variable?.id,
          "value": data?.variable_value?.id,
          "effect": data?.effect,
          "effectType": data?.effect_type == 'positive'?  true: false
        }
        const res = await addDominalVariables(searchParams.get('equationId') || '',data?.variable?.type !== 'Range'? dataList : dataRange);

        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Added success!', {
            variant: 'success',
          });
        }


    },
    []
  );

  const onSubmit = useCallback(
    async (data: any) => {

      const dataFormRange = {
        "scientificName": medicine?.id,
        "formula": formula?.id,
        "indication": indication?.id,
        "initialDose": initialDosage?.dosage,
        "dominalVariables": [
          {
            "variableId": data?.variable?.id,
            "variableName":data?.variable?.name,
            "type":data?.variable?.type,
            "minValue":  data?.variable_value?.[0] ,
            "maxValue":   data?.variable_value?.[1] ,
            "effect": data?.effect,
            "effectType": data?.effect_type == 'positive'?  true: false
          }
        ]
      };
      const dataFormList = {
        "scientificName": medicine?.id,
        "formula": formula?.id,
        "indication": indication?.id,
        "initialDose": initialDosage?.dosage,
        "dominalVariables": [
          {
            "variableId": data?.variable?.id,
            "type":data?.variable?.type,
            "variableName":data?.variable?.name,
            "value": data?.variable_value?.id,
            "effect": data?.effect,
            "effectType": data?.effect_type == 'positive'?  true: false
          }
        ]
      };

      if(searchParams.get('variableId')){
        const dataRange ={
          "id": currentVariable?.id,
          "variableId": currentVariable?.variableId,
            "variableName":data?.variable?.name,
            "minValue":  data?.variable_value?.[0] ,
            "maxValue":   data?.variable_value?.[1] ,
            "effect": data?.effect,
            "effectType": data?.effect_type == 'positive'?  true: false

        }
        const dataList = {
          "id": currentVariable?.id,
          "variableId": currentVariable?.variableId,
          "variableName":data?.variable?.name,
          "value": data?.variable_value?.id,
          "effect": data?.effect,
          "effectType": data?.effect_type == 'positive'?  true: false
        }

        const res = await editDominalVariables( data?.variable?.type !== 'Range'? dataList : dataRange);
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          enqueueSnackbar('Updated success!', {
            variant: 'success',
          });
        }
      }


      else {

        const res = await createEquation( data?.variable?.type !== 'Range'? dataFormList : dataFormRange);
        if (res?.error) {
          enqueueSnackbar(`${res?.error || 'there is something wrong!'}`, { variant: 'error' });
        } else {
          createQueryString([{ name: 'equationId', value: String(res?.id)  }]);
          enqueueSnackbar('Created success!', {
            variant: 'success',
          });
          if(!searchParams.get('equationId')){

            createQueryString([{ name: 'equationId', value: String(res?.id)  }]);
          }
        }
      }


    },
    []
  );

  return (
    <>
      <FormProvider methods={methods} onSubmit={handleSubmit(addVariable? submitAdd :onSubmit)}>
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
              value={initialDosage?.dosage || 100}
              InputProps={{ endAdornment:  initialDosage?.isWeightDependent?
                <InputAdornment position="end">mg/kg</InputAdornment>:
               <InputAdornment position="end">mg</InputAdornment>, }}
              disabled
            />
          </Grid>


          <Grid item xs={12} sm={6}>
            <RHFAutocomplete
              name="variable"
              label={t('Variable')}
              placeholder={t('Variable')}
            //  disabled={!!currentVariable}

              options={allVariables  || getSelectedVariables as IVariable}
              getOptionLabel={(option:any) => {
                if (typeof option?.name == 'string') {

                  return option?.name;
                }
                return '';
              }}
              onChange={(event, item:any) => {
                if (item) {
                  setVariable(item);
                  setValue('variable', item)

                } else {
                  setVariable();
                }


                setVariableValue(null);
                setValue('variable_value', {id:'', value:''});
              }}
            />
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

                options={
                  (variable?.values?.map((item) => ({
                   id:item,
                   value:item
                  })) || []) as ITems[]
                }
                getOptionLabel={(option:any) => {
                  if (typeof option?.value == 'string') {

                    return option?.value;
                  }
                  return '';
                }}
                onChange={(_event, item:any) => {
                  if (item) {
                   setValue('variable_value', item)
                    setVariableValue( item );
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


          <Grid item xs={12} sx={{gap:1, display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton type="submit" variant="contained" color="primary" loading={isSubmitting}>
              {t(searchParams.get('variableId') ? 'Edit' : 'Save')}
            </LoadingButton>
            <LoadingButton onClick={()=>setAddVariable(true)} disabled={!searchParams.get('equationId')} type="submit" variant="contained" color="primary" loading={isSubmitting}>
             Add
            </LoadingButton>
          </Grid>

        </Grid>
      </FormProvider>
      <Box />
    </>
  );
}


