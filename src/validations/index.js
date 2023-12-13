import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import apply from 'ajv-formats-draft2019';

const ajv = new Ajv({ allErrors: true });
apply(ajv, { formats: ['idn-email', 'iri'] });
ajvErrors(ajv);

const userValidations = {
  type: 'object',
  properties: {
    name: { type: 'string', minLength: 2, maxLength: 55 },
    email: {
      type: 'string',
      format: 'idn-email',
      minLength: 5,
      maxLength: 50,
      errorMessage: {
        format: "Email format isn't valid, it must follow 'idn-email' format",
      },
    },
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
    ? res.status(400).send({
        error: ajv.errors,
        TimeStamp: Date(),
        handlerLocation: 'UserValidation',
        message: "User data isn't valid",
      })
    : next();
}
