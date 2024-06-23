import * as yup from 'yup';

export const requiredYupItem = (msg: string | ((m: string) => string)) =>
  yup
    .object()
    .shape({
      name: yup.string().required(msg),
      name_ar: yup.string().required(msg),
      name_en: yup.string().required(msg),
      id: yup.string().required(msg),
    })
    .required(msg);
