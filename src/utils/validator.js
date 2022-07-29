import * as yup from 'yup';
import { setLocale } from 'yup';

setLocale({
  mixed: {
    default: 'validationError',
    notOneOf: 'duplicatedURL',
  },
  string: {
    url: 'invalidURL',
  },
});

const validator = (urlToValidate, alreadyExisting) => {
  const schema = yup.string().url().notOneOf(alreadyExisting);

  try {
    return schema.validate(urlToValidate);
  } catch (err) {
    return err;
  }
};

export default validator;
