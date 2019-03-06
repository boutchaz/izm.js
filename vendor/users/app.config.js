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
        validate: process.env.MODULE_USERS_PHONE_VALIDATE === 'true',
        code_length: process.env.MODULE_USERS_PHONE_CODE_LENGTH || 4,
        max_tries: process.env.MODULE_USERS_PHONE_MAX_TRIES || 10,
        authenticate: process.env.MODULE_USERS_PHONE_IS_AUTHENTICATE === 'true',
        max_resends: process.env.MODULE_USERS_PHONE_MAX_RESENDS || 4,
      },
      email: {
        validate: process.env.MODULE_USERS_EMAIL_VALIDATE === 'true',
        code_length: process.env.MODULE_USERS_EMAIL_CODE_LENGTH || 80,
        max_tries: process.env.MODULE_USERS_EMAIL_MAX_TRIES || 10,
        authenticate: process.env.MODULE_USERS_EMAIL_IS_AUTHENTICATE === 'true',
        max_resends: process.env.MODULE_USERS_EMAIL_MAX_RESENDS || 4,
      },
    },
  };

  // Twilio configuration
  const twilio = {
    from: process.env.TWILIO_FROM || 'TWILIO_FROM',
    accountID: process.env.TWILIO_ACCOUNT_SID || 'TWILIO_ACCOUNT_SID',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'TWILIO_AUTH_TOKEN',
  };

  // sendGrid configuration
  const sendGrid = {
    key: process.env.SENDGRID_API_KEY || 'SENDGRID_API_KEY',
  };

  // SMTP mailer configuration
  const mailer = {
    from: process.env.MAILER_FROM || 'MAILER_FROM',
    options: {
      host: process.env.MAILER_HOST || 'smtp.gmail.com',
      port: process.env.MAILER_PORT || 465,
      secure: process.env.MAILER_SECURE !== 'false',
      auth: {
        user: process.env.MAILER_AUTH_USER || 'MAILER_AUTH_USER',
        pass: process.env.MAILER_AUTH_PASS || '',
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
        default: (process.env.MODULE_USERS_DEFAULT_GROUPS || 'user').split(','),
      },
    },
  };
};
