import * as yup from 'yup';
import { setLocale } from 'yup';
import yupLocale from '../locales/yupLocale.js';

const validator = (urlToValidate, alreadyExisting) => {
  setLocale(yupLocale);
  const schema = yup.string().required().url().notOneOf(alreadyExisting);
  try {
    return schema.validateSync(urlToValidate);
  } catch (err) {
    return err;
  }
};

export default validator;
