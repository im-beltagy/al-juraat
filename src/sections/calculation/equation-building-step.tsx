'use client';

import * as yup from 'yup';
import { useForm } from 'react-hook-form';
import { useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { yupResolver } from '@hookform/resolvers/yup';

import { Box, Grid } from '@mui/material';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import { RHFAutocomplete } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import CustomAutocompleteView, { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';

import { IVariableItem, yupCalculationItem } from 'src/types/calculations';

import { useCalculationStore } from './calculation-store';

export interface Props {
  medicines: ITems[];
  formulas?: ITems[];
  indications?: ITems[];
  variables: IVariableItem[];
}

export default function EquationBuildingStep({
  medicines,
  formulas,
  indications,
  variables,
}: Props) {
  const { t } = useTranslate();

  const { createQueryString } = useQueryString();

  const searchParams = useSearchParams();
  const medicine = searchParams.get('medicine');
  const formulaId = searchParams.get('formula');
  const indicationId = searchParams.get('indication');

  const { setMedicine, setFormula, setIndication, setAllVariables, allVariables } =
    useCalculationStore((store) => ({
      setMedicine: store.setMedicine,
      setFormula: store.setFormula,
      setIndication: store.setIndication,
      setAllVariables: store.setAllVariables,
      allVariables: store.allVariables,
    }));

  const { medicineItem, formulaItem, indicationItem } = useMemo(
    () => ({
      medicineItem: medicines.find((m) => m.id === medicine) || null,
      formulaItem: formulas?.find((f) => f.id === formulaId) || null,
      indicationItem: indications?.find((i) => i.id === indicationId) || null,
    }),
    [formulaId, formulas, indicationId, indications, medicine, medicines]
  );

  const methods = useForm({
    resolver: yupResolver(
      yup.object().shape({
        medicine: yupCalculationItem,
        formula: yupCalculationItem,
        indication: yupCalculationItem,
        variables: yup.array(yupCalculationItem).nullable(),
      })
    ),
    defaultValues: {
      medicine: medicineItem,
      formula: formulaItem,
      indication: indicationItem,
      variables:
        variables
          .filter((v) => allVariables?.some(({ id }) => id === v.id))
          .map((item) => ({ ...item, name_ar: item.name, name_en: item.name }) as ITems) || null,
    },
  });

  const choosenVariables = methods.watch('variables');

  useEffect(() => {
    const refactoredVariables = variables.filter(
      (v) => choosenVariables?.some((item) => item?.id === v.id)
    );
    setAllVariables(refactoredVariables.length > 0 ? refactoredVariables : undefined);
  }, [choosenVariables, setAllVariables, variables]);

  useEffect(() => {
    if (medicineItem) {
      const { name, id } = medicineItem;
      setMedicine({ name, id });
    }
    if (formulaItem) {
      const { name, id } = formulaItem;
      setFormula({ name, id });
    }
    if (indicationItem) {
      const { name, id } = indicationItem;
      setIndication({ name, id });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <FormProvider methods={methods}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="medicine"
              label={t('Scientific name')}
              placeholder={t('Scientific name')}
              items={medicines}
              onCustomChange={(item) => {
                if (item) {
                  const { name, id } = item;
                  setMedicine({ name, id });
                  createQueryString([{ name: 'medicine', value: id }]);
                } else {
                  setMedicine();
                  setFormula();
                  setIndication();
                  createQueryString([{ name: 'medicine' }]);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="formula"
              label={t('Formula')}
              placeholder={t('Formula')}
              items={formulas || []}
              onCustomChange={(item) => {
                if (item) {
                  const { name, id } = item;
                  setFormula({ name, id });
                  createQueryString([{ name: 'formula', value: id }]);
                } else {
                  setFormula();
                  createQueryString([{ name: 'formula' }]);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <CustomAutocompleteView
              name="indication"
              label={t('Indication')}
              placeholder={t('Indication')}
              items={indications || []}
              onCustomChange={(item) => {
                if (item) {
                  const { name, id } = item;
                  setIndication({ name, id });
                  createQueryString([{ name: 'indication', value: id }]);
                } else {
                  setIndication();
                  createQueryString([{ name: 'indication' }]);
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <RHFAutocomplete
              name="variables"
              label={t('Variables')}
              placeholder={t('Choose one or more variable')}
              multiple
              options={variables.map(
                (item) => ({ ...item, name_ar: item.name, name_en: item.name }) as ITems
              )}
              getOptionLabel={(option) => {
                if (typeof option !== 'string') {
                  return option.name_en;
                }
                return '';
              }}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              filterSelectedOptions
              ChipProps={{
                variant: 'soft',
                color: 'info',
                sx: {
                  letterSpacing: 1,
                },
              }}
            />
          </Grid>
        </Grid>
      </FormProvider>
      <Box />
    </>
  );
}
