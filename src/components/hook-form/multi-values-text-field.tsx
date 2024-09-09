import { useState, useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { Chip, TextField, TextFieldProps } from '@mui/material';

type Props = TextFieldProps & {
  name: string;
  value?: string[];
  rules?: { [key: string]: any };
  type?: 'text' | 'number';
};

export function MultiValuesTextField({
  rules,
  value,
  name,
  helperText,
  type = 'text',
  ...other
}: Props) {
  const { control, setValue } = useFormContext();

  useEffect(() => {
    setValue(name, value);
  }, [setValue, name, value]);

  const [textValue, setTextValue] = useState<string>('');

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState: { error } }) => (
        <TextField
          {...field}
          fullWidth
          value={textValue}
          onChange={(event) => setTextValue(event.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const currentValue = (field.value as string[]) || [];

              if (!currentValue.includes(textValue) && textValue.trim()) {
                field.onChange([...currentValue, textValue.trim()]);
                setTextValue('');
              }
            }
          }}
          error={!!error}
          helperText={error ? error?.message : helperText}
          InputProps={{
            startAdornment: field.value?.length
              ? field.value.map((val: string, index: number) => (
                  <Chip
                    key={index}
                    size="small"
                    label={val}
                    variant="soft"
                    color="info"
                    onDelete={() =>
                      field.onChange(field.value?.filter((v: string, i: number) => v !== val))
                    }
                    sx={{
                      width: 'fit-content',
                      height: 32,
                      minWidth: 60,
                      '.MuiChip-label': {
                        pl: 1.5,
                        pr: 1.5,
                        letterSpacing: '1px',
                      },
                    }}
                  />
                ))
              : null,
          }}
          {...other}
          sx={{
            '.MuiInputBase-root': {
              padding: '9px',
              flexWrap: 'wrap',
              gap: 1,
              '.MuiInputBase-input': {
                width: '0',
                minWidth: '30px',
                flexGrow: '1',
                p: '7.5px 4px',
              },
            },
            ...other.sx,
          }}
        />
      )}
    />
  );
}
