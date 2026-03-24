import Joi from 'joi';

export const loginSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Tên đăng nhập không được để trống',
    'any.required': 'Tên đăng nhập không được để trống',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Mật khẩu phải có ít nhất 6 ký tự',
    'string.empty': 'Mật khẩu không được để trống',
    'any.required': 'Mật khẩu không được để trống',
  }),
});

export const registerSchema = Joi.object({
  username: Joi.string().min(3).required().messages({
    'string.min': 'Tên đăng nhập phải có ít nhất 3 ký tự',
    'string.empty': 'Tên đăng nhập không được để trống',
    'any.required': 'Tên đăng nhập không được để trống',
  }),
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
