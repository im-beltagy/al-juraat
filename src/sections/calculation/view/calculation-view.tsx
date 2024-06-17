'use client';

import React, { useState, ReactNode } from 'react';

import { Container } from '@mui/system';
import { Box, Step, Button, Stepper, StepLabel } from '@mui/material';

import { useTranslate } from 'src/locales';

import { useSettingsContext } from 'src/components/settings';
import { ITems } from 'src/components/AutoComplete/CutomAutocompleteView';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs/custom-breadcrumbs';

import { IDosageItem, IVariableItem } from 'src/types/calculations';

import { useCalculationStore } from '../calculation-store';
import DominalVariableStep from '../dominal-variable-step';
import EquationBuildingStep from '../equation-building-step';

const titles = ['Equation Building', 'Calculation', 'Final Result', 'Custom Patient'];
const steps = ['Selection of medication', 'Dominal variables', 'Final result'];

interface Props {
  medicines: ITems[];
  formulas?: ITems[];
  indications?: ITems[];
  variables: IVariableItem[];
  initialDosage?: IDosageItem;
}

export default function CalculationView({
  medicines,
  formulas,
  indications,
  variables,
  initialDosage,
}: Props) {
  const { t } = useTranslate();
  const settings = useSettingsContext();

  const [activeStep, setActiveStep] = useState(0);

  return (
    <Container
      maxWidth={settings.themeStretch ? false : 'xl'}
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <CustomBreadcrumbs heading={t(titles[activeStep])} links={[{}]} sx={{ mb: 3 }} />

      <StepperView activeStep={activeStep} setActiveStep={(val) => setActiveStep(val)}>
        <Box mt={3} />
        {activeStep === 0 ? (
          <EquationBuildingStep
            medicines={medicines}
            formulas={formulas}
            indications={indications}
            variables={variables}
          />
        ) : null}
        {activeStep === 1 ? (
          <DominalVariableStep variables={variables} initialDosage={initialDosage} />
        ) : null}
      </StepperView>
    </Container>
  );
}

interface StepperViewProps {
  activeStep: number;
  setActiveStep: (step: any) => void;
  children: ReactNode;
}

function StepperView({ activeStep, setActiveStep, children }: StepperViewProps) {
  const { t } = useTranslate();

  const handleNext = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep: number) => prevActiveStep - 1);
  };

  const isNextValid = useCalculationStore(
    ({ medicine, formula, indication }) => medicine && formula && indication
  );

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => {
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

      {activeStep < steps.length ? (
        <Box display="flex" mt={3}>
          <Box sx={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            {t('Prev')}
          </Button>
          <Button variant="contained" color="primary" disabled={!isNextValid} onClick={handleNext}>
            {t(activeStep === steps.length - 1 ? 'Create custom patient' : 'Next')}
          </Button>
        </Box>
      ) : null}
    </>
  );
}
