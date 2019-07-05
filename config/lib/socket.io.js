const cookieParser = require('cookie-parser');
const { connection } = require('mongoose');
const session = require('express-session');
const socketio = require('socket.io');
const passport = require('passport');
const { resolve } = require('path');
const MongoStore = require('connect-mongo')(session);

const config = require('..');

// Define the Socket.io configuration method
module.exports = (app) => {
  // Create a new Socket.io server
  const io = socketio.listen(app);

  // Create a MongoDB storage object
  const mongoStore = new MongoStore({
    collection: config.sessionCollection,
    mongooseConnection: connection,
  });

  // Intercept Socket.io's handshake request
  io.use((socket, next) => {
    // Use the 'cookie-parser' module to parse the request cookies
    cookieParser(config.sessionSecret)(socket.request, {}, () => {
      // Get the session id from the request cookies
      const sessionId = socket.request.signedCookies
        ? socket.request.signedCookies[config.sessionKey]
        : false;

      if (!sessionId) return next(new Error('sessionId was not found in socket.request'), false);

      // Use the mongoStorage instance to get the Express session information
      return mongoStore.get(sessionId, (error, sess) => {
        const s = socket;
        if (error) return next(error, false);
        if (!sess) return next(new Error(`session was not found for ${sessionId}`), false);

        // Set the Socket.io session information
        s.request.session = sess;

        // Use Passport to populate the user details
        return passport.initialize()(socket.request, {}, () => {
          passport.session()(socket.request, {}, () => {
            if (socket.request.user) {
              next(null, true);
            } else {
              next(new Error('User is not authenticated'), false);
            }
          });
        });
      });
    });
  });

  // Add an event listener to the 'connection' event
  io.on('connection', (socket) => {
    config.files.server.sockets.forEach((socketConfiguration) => {
      // eslint-disable-next-line import/no-dynamic-require,global-require
      require(resolve(socketConfiguration))(io, socket);
    });
  });

  // return server;
  return app;
};
