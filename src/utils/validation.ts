import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email({ tlds: { allow: false } }).required().messages({
    'string.email': 'Email không hợp lệ',
    'string.empty': 'Email không được để trống',
    'any.required': 'Email không được để trống',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu không được để trống',
  }),
});

export const password = (value: string, helpers: any) => {
  if (value.length < 8) {
    return helpers.message('Mật khẩu phải có ít nhất 8 ký tự');
  }
  if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
    return helpers.message('Mật khẩu phải chứa ít nhất một chữ cái và một chữ số');
  }
  return value;
};

export const registerSchema = Joi.object({
  name: Joi.string().required().messages({
    'any.required': 'Tên là bắt buộc',
  }),
  email: Joi.string().required().email({ tlds: { allow: false } }).messages({
    'string.email': 'Email không hợp lệ',
    'any.required': 'Email là bắt buộc',
  }),
  password: Joi.string().required().custom(password),
});
