const { resolve } = require('path');

module.exports = {
  log: {
    format: ':remote-addr - :remote-user [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent"',
  },
  db: {
    promise: global.Promise,
  },
  host: process.env.HOST || '127.0.0.1',
  port: process.env.PORT || 3000,
  prefix: '/api/v1',
  // Session Cookie settings
  sessionCookie: {
    // session expiration is set by default to 24 hours
    maxAge: 24 * (60 * 60 * 1000),
    // httpOnly flag makes sure the cookie is only accessed
    // through the HTTP protocol and not JS/browser
    httpOnly: true,
    // secure cookie should be turned to true to provide additional
    // layer of security so that the cookie is set only when working
    // in HTTPS mode.
    secure: false,
  },
  // sessionSecret should be changed for security measures and concerns
  sessionSecret: process.env.SESSION_SECRET || 'MEA2N',
  // sessionKey is set to the generic sessionId key used by PHP applications
  // for obsecurity reasons
  sessionKey: 'sessionId',
  sessionCollection: 'sessions',
  lib: {
    mongoose: {
      timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      },
    },
  },
  uploads: {
    uploader: {
      limits: {
        fileSize: 52428800, // Max file size in bytes (50 MB)
      },
      thumbnail: {
        width: 100,
        height: 100,
      },
    },
  },
  i18next: {
    detector: {
      // order and from where user language should be detected
      order: ['querystring', 'cookie'],

      // keys or params to lookup language from
      lookupQuerystring: '$lng',
      lookupCookie: 'i18next',
      lookupFromPathIndex: 0,

      // cache user language
      caches: false,
    },
    init: {
      fallbackLng: 'fr',
      preload: ['fr', 'en'],
      saveMissing: true,
      fallbackNS: 'vendor:core',
      defaultNS: 'vendor:core',
      debug: false,
      backend: {
        loadPath: (lng, ns) => {
          const [type, name] = ns.split(':');
          return resolve(`${type}/${name}/i18n/${lng}.json`);
        },
        addPath: (lng, ns) => {
          const [type, name] = ns.split(':');
          return resolve(`${type}/${name}/i18n/${lng}.missing.json`);
        },
      },
    },
  },
  validations: {
    types: ['email'],
    mondatory: ['email'],
  },
};
