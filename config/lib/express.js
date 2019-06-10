/**
 * Module dependencies.
 */
const config = require('..');
const express = require('express');
const debug = require('debug')('config:express');
const morgan = require('morgan');
const logger = require('./logger');
const bodyParser = require('body-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const compress = require('compression');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const flash = require('connect-flash');
const path = require('path');
const i18next = require('i18next');
const i18nextMiddleware = require('i18next-express-middleware');
const Backend = require('i18next-node-fs-backend');
const fs = require('fs');
const nunjucks = require('nunjucks');

const { vendor, custom } = config.files.server.modules;

/**
 * Initialize local variables
 */
module.exports.initLocalVariables = (app) => {
  const { locals } = app;

  // Setting application local variables
  if (config.secure && config.secure.ssl === true) {
    locals.secure = config.secure.ssl;
  }

  // Passing the request url to environment locals
  app.use((req, res, next) => {
    res.locals.host = `${req.protocol}://${req.hostname}`;
    res.locals.url = `${req.protocol}://${req.headers.host}${req.originalUrl}`;
    next();
  });
};

/**
 * Run bootstrap files
 */
module.exports.runBootstrap = (app, db) => {
  const promises = config.files.server.bootstraps.map(async (f) => {
    // eslint-disable-next-line
    const m = require(path.resolve(f));

    if (typeof m === 'function') {
      try {
        debug('Bootstraping file %s', f);
        await m(config, app, db);
        debug('file "%s" executed successfully', f);
      } catch (e) {
        console.error('Error bootstraping file "%s"', f, e);
        return false;
      }
    }

    return true;
  });

  return Promise.all(promises);
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = (app) => {
  const { locals } = app;

  // Showing stack errors
  app.set('showStackError', true);

  // Enable jsonp
  app.enable('jsonp callback');

  // Should be placed before express.static
  app.use(compress({
    filter(req, res) {
      return /json|text|javascript|css|font|svg/.test(res.getHeader('Content-Type'));
    },
    level: 9,
  }));

  // Enable logger (morgan)
  app.use(morgan(logger.getFormat(), logger.getOptions()));

  // Environment dependent middleware
  if (process.env.NODE_ENV === 'development') {
    // Disable views cache
    app.set('view cache', false);
  } else if (process.env.NODE_ENV === 'production') {
    locals.cache = 'memory';
  }

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.json({ limit: '4mb', extended: true }));
  app.use(bodyParser.urlencoded({ limit: '4mb', extended: true }));
  app.use(methodOverride());
  // Add the cookie parser and flash middleware
  app.use(cookieParser());
  app.use(flash());
  app.use('/assets', express.static('assets'));
  app.use(express.static('public'));
};

/**
 * Configure view engine
 */
module.exports.initViewEngine = (app) => {
  nunjucks.configure('./', {
    autoescape: true,
    express: app,
  });

  // Set views path and view engine
  app.set('view engine', 'server.view.swig');
};

/**
 * Configure Express session
 */
module.exports.initSession = (app, db) => {
  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: config.sessionSecret,
    cookie: {
      maxAge: config.sessionCookie.maxAge,
      httpOnly: config.sessionCookie.httpOnly,
      secure: config.sessionCookie.secure && config.secure.ssl,
    },
    name: config.sessionKey,
    store: new MongoStore({
      db,
      collection: config.sessionCollection,
    }),
  }));

  // Add Lusca CSRF Middleware
  // app.use(lusca(config.csrf));
};

/**
 * Invoke modules server configuration
 */
module.exports.initModulesConfiguration = (app, db) => {
  config.files.server.configs.forEach((configPath) => {
    // eslint-disable-next-line
    require(path.resolve(configPath))(app, db, config);
  });
};

/**
 * Configure Helmet headers configuration
 */
module.exports.initHelmetHeaders = (app) => {
  // Use helmet to secure Express headers
  const SIX_MONTHS = 15778476000;
  app.use(helmet({
    maxAge: SIX_MONTHS,
    includeSubdomains: true,
    force: true,
  }));
  app.disable('x-powered-by');
};

/**
 * Configure the modules server routes
 */
module.exports.initModulesServerRoutes = (app) => {
  // Globbing routing files
  config.files.server.routes.forEach((routePath) => {
    // eslint-disable-next-line
    const m = require(path.resolve(routePath));
    if (typeof m === 'function') {
      m(app);
    } else {
      app.use(config.prefix + m.prefix, m.router(app));
    }
  });
};

/**
 * Configure i18n
 */
module.exports.initI18n = (app) => {
  const lngDetector = new i18nextMiddleware.LanguageDetector(
    null,
    config.i18next.detector,
  );

  const getDirsNames = () => {
    const modules = [vendor, ...custom];
    const names = modules.map(source => fs
      .readdirSync(source)
      .map((name) => {
        const p = path.join(source, name);

        if (!fs.lstatSync(p).isDirectory()) {
          return false;
        }

        return `${source}:${name}`;
      })
      .filter(Boolean));

    return Array.prototype.concat.apply([], names);
  };

  i18next
    .use(Backend)
    .use(lngDetector)
    .init({
      ...config.i18next.init,
      ns: getDirsNames(),
    });

  app.use(i18nextMiddleware.handle(i18next));
};

/**
 * Configure error handling
 */
module.exports.initErrorRoutes = (app) => {
  app.use((err, req, res, next) => {
    // If the error object doesn't exists
    if (!err) {
      return next();
    }

    // Log it
    console.error(err.stack);

    // Redirect to error page
    return res.status(500).render(`${vendor}/core/views/500`, {
      error: req.t('ERRORS_500'),
    });
  });
};

/**
 * Initialize the Express application
 */
module.exports.init = async (db) => {
  // Initialize express app
  const app = express();

  // Run bootstrap files
  await this.runBootstrap(app, db);

  // Initialize local variables
  this.initLocalVariables(app, db);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize Express view engine
  this.initViewEngine(app);

  // Initialize Express session
  this.initSession(app, db);

  // Initialize modules server i18n
  this.initI18n(app);

  // Initialize Modules configuration
  this.initModulesConfiguration(app);

  // Initialize Helmet security headers
  this.initHelmetHeaders(app);

  // Initialize modules server routes
  this.initModulesServerRoutes(app);

  // Initialize error routes
  this.initErrorRoutes(app);

  return app;
};
