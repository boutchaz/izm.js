// eslint-disable-next-line import/no-unresolved
const { getFromEnv } = require('utils');

module.exports = () => {
  // Profile configuration
  const profile = {
    picture: {
      default: {
        male: '/assets/img/male.png',
        female: '/assets/img/female.png',
      },
      thumbnail: '100x100',
      accept: [
        'image/png',
        'image/jpeg',
      ],
    },
    protected_attrs: [
      'validations',
      'salt',
      'updated_at',
      'created_at',
      'provider',
    ],
    private_attrs: [
      'validations',
      'salt',
      'password',
    ],
  };

  // Supported validations
  const validations = {
    mondatory: [],
    types: [],
    config: {
      phone: {
        validate: getFromEnv('PHONE_VALIDATE', false, 'boolean', 'users'),
        code_length: getFromEnv('PHONE_CODE_LENGTH', 4, 'integer', 'users'),
        max_tries: getFromEnv('PHONE_MAX_TRIES', 10, 'integer', 'users'),
        authenticate: getFromEnv('PHONE_IS_AUTHENTICATE', false, 'boolean', 'users'),
        max_resends: getFromEnv('PHONE_MAX_RESENDS', 4, 'integer', 'users'),
      },
      email: {
        validate: getFromEnv('EMAIL_VALIDATE', false, 'boolean', 'users'),
        code_length: getFromEnv('EMAIL_CODE_LENGTH', 80, 'integer', 'users'),
        max_tries: getFromEnv('EMAIL_MAX_TRIES', 10, 'integer', 'users'),
        authenticate: getFromEnv('EMAIL_IS_AUTHENTICATE', false, 'boolean', 'users'),
        max_resends: getFromEnv('EMAIL_MAX_RESENDS', 4, 'integer', 'users'),
      },
    },
  };

  // Twilio configuration
  const twilio = {
    from: getFromEnv('TWILIO_FROM', 'TWILIO_FROM', 'string', 'users'),
    accountID: getFromEnv('TWILIO_ACCOUNT_SID', 'TWILIO_ACCOUNT_SID', 'string', 'users'),
    authToken: getFromEnv('TWILIO_AUTH_TOKEN', 'TWILIO_AUTH_TOKEN', 'string', 'users'),
  };

  // sendGrid configuration
  const sendGrid = {
    key: getFromEnv('SENDGRID_API_KEY', 'SENDGRID_API_KEY', 'string', 'users'),
  };

  // SMTP mailer configuration
  const mailer = {
    from: getFromEnv('MAILER_FROM', 'MAILER_FROM@example.com'),
    options: {
      host: getFromEnv('MAILER_HOST', 'smtp.gmail.com'),
      port: getFromEnv('MAILER_PORT', 456, 'number'),
      secure: getFromEnv('MAILER_SECURE', true, 'boolean'),
      auth: {
        user: getFromEnv('MAILER_AUTH_USER', 'MAILER_AUTH_USER'),
        pass: getFromEnv('MAILER_AUTH_PASS', 'MAILER_AUTH_PASS'),
      },
    },
  };

  // Return the module configuration
  return {
    mailer,
    twilio,
    sendGrid,
    validations,
    app: {
      profile,
      roles: {
        default: getFromEnv('DEFAULT_GROUPS', 'user', 'string', 'users').split(','),
      },
    },
  };
};
