'use client';

import { useSearchParams } from 'next/navigation';
import React, { ReactNode, useEffect } from 'react';

import { Container } from '@mui/system';
import { Box, Step, Button, Stepper, StepLabel } from '@mui/material';

import { useQueryString } from 'src/hooks/use-queryString';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IDosageItem, IVariableItem, ICalculationResult } from 'src/types/calculations';

import FinalResultStep from '../final-result-step';
import CustomPatientStep from '../custom-patient-step';
import { useCalculationStore } from '../calculation-store';
 import DominalVariableStep from '../dominal-variable-step';
import EquationBuildingStep from '../equation-building-step';
import { IVariable } from 'src/types/variables';
import { Result } from 'src/types/results';

const titles = ['Equation Building', 'Calculation', 'Final Result', 'Custom Patient'];
const stepsTitles = [
  'Selection of medication',
  'Dominal variables',
  'Final result',
  'Custom Patient',
];
const steps = stepsTitles.map((title) => title.toLowerCase().replaceAll(' ', '-'));

interface Props {
  medicines: string[];
  formulas?: string[];
  indications?: string[];
  variables: IVariable[];
  initialDosage?: IDosageItem;
  results: Result;
}

export default function CalculationView({
  medicines,
  formulas,
  indications,
  variables,
  initialDosage,
  results,
}: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();
  const searchParams = useSearchParams();

  const activeStep = searchParams.get('step') || steps[0];
  const stepIndex = steps.indexOf(activeStep);

  const { setMedicine, setFormula, setIndication } = useCalculationStore(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    ({ setMedicine, setFormula, setIndication }) => ({ setMedicine, setFormula, setIndication })
  );

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t(titles[stepIndex])} links={[{}]} sx={{ mb: 3 }} />

      <StepperView activeStep={activeStep}>
        <Box mt={3} />
        {stepIndex === 0 ? (
          <EquationBuildingStep
            medicines={medicines}
            formulas={formulas}
            indications={indications}
            variables={variables}
          />
        ) : null}
        {stepIndex === 1 ? (

          <DominalVariableStep variables={variables} initialDosage={initialDosage} />
        ) : null}
        {stepIndex === 2 ? (
          <FinalResultStep initialDosage={initialDosage} results={results} />
        ) : null}
        {stepIndex === 3 ? (
          <CustomPatientStep initialDosage={initialDosage} results={results} />
        ) : null}
      </StepperView>
    </Container>
  );
}

interface StepperViewProps {
  activeStep: string;
  children: ReactNode;
}

function StepperView({ activeStep, children }: StepperViewProps) {
  const stepIndex = steps.indexOf(activeStep);

  const { t } = useTranslate();

  const { createQueryString } = useQueryString();

  const handleNext = () => {
    createQueryString([{ name: 'step', value: steps[stepIndex + 1] }], true);
  };

  const handleBack = () => {
    createQueryString([{ name: 'step', value: steps[stepIndex - 1] }, { name: 'variable' }], true);
  };
  const getSelectedMedicine = JSON.parse(sessionStorage.getItem('medicine') as string);
  const getSelectedFormula = JSON.parse(sessionStorage.getItem('formula') as string);
  const getSelectedIndication = JSON.parse(sessionStorage.getItem('indication') as string);
  const getSelectedVariables = JSON.parse(sessionStorage.getItem('selectedVariables') as string);
  const isNextValid = getSelectedMedicine && getSelectedFormula &&getSelectedIndication &&getSelectedVariables;

  return (
    <>
      <Stepper activeStep={stepIndex} alternativeLabel>
        {stepsTitles.slice(0, 3).map((label) => {
          const stepProps: { completed?: boolean } = {};
          const labelProps: {
            optional?: React.ReactNode;
          } = {};
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{t(label)}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {children}

      {stepIndex < steps.length - 1 ? (
        <Box display="flex" mt={3}>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            disabled={stepIndex === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {t('Prev')}
          </Button>
          <Button variant="contained" color="primary" disabled={!isNextValid} onClick={handleNext}>
            {t(stepIndex === steps.length - 2 ? 'Create custom patient' : 'Next')}
          </Button>
        </Box>
      ) : null}
    </>
  );
}
