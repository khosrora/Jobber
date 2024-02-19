import Joi, { ObjectSchema } from 'joi';

const signupSchema: ObjectSchema = Joi.object().keys({
  username: Joi.string().min(4).max(12).required().messages({
    'string.base': 'Username must be of type string',
    'string.min': 'Invalid username',
    'string.max': 'Invalid username',
    'string.empty': 'Username is a rquired field'
  }),
  password: Joi.string().min(4).max(12).required().messages({
    'string.base': 'password must be of type string',
    'string.min': 'Invalid password',
    'string.max': 'Invalid password',
    'string.empty': 'password is a rquired field'
  }),
  country: Joi.string().required().messages({
    'string.base': 'Country must be of type string',
    'string.empty': 'Country is a rquired field'
  }),
  email: Joi.string().email().required().messages({
    'string.base': 'Email must be of type string',
    'string.email': 'Invalid email',
    'string.empty': 'email is a rquired field'
  }),
  profilePicture: Joi.string().required().messages({
    'string.base': 'please add a profile picture',
    'string.email': 'Profile pictures is required',
    'string.empty': 'Profile pictures is required'
  })
});

export { signupSchema };
