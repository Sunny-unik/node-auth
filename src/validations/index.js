import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);

const userValidations = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 55 },
    email: { type: 'string', minLength: 5, maxLength: 50 },
    password: {
      type: 'string',
      maxLength: 16,
      pattern: '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
      errorMessage: {
        pattern:
          'Password must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long',
      },
    },
    otp: { type: 'string' },
  },
  required: ['name', 'email', 'password'],
  additionalProperties: false,
};

export default function UserValidation(req, res, next) {
  !ajv.validate(userValidations, req.body)
    ? res.send({
        error: ajv.errors,
        TimeStamp: Date(),
        handlerLocation: 'UserValidation',
      })
    : next();
}
