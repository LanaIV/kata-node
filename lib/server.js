'use strict';

var
  namespace    = 'lib:server',
  log4js       = require('log4js'),
  routes       = require('routes'),
  express      = require('express'),
  cluster      = require('cluster'),
  favicon      = require('serve-favicon'),
  logger       = log4js.getLogger(namespace),
  accessLogger = log4js.getLogger(namespace + ':access')
;

if (cluster.isMaster) {
  cluster.on('exit', function(worker, code, signal) {
    logger.warn('Worker ' + worker.id + ' died', code, signal, worker.process.pid);
    cluster.fork();
  });

  return cluster.fork();
}

var app = express();

app.use(log4js.connectLogger(accessLogger));

app.use(favicon(__dirname + '/../public/favicon.ico'));

app.use(function(req, res, next) {
  if (!/\/$|\/\?/.test(req.originalUrl)) {
    return res.send(404);
  }

  return next();
});

routes(app);

app.listen('3000');

logger.trace('Worker ' + cluster.worker.id + ' running...');

process.on('uncaughtException', function(err) {
  var ERROR_NOREFORK = 5001;

  logger.fatal('uncaughtException: ', err.message);
  logger.fatal(err.stack);

  process.exit(ERROR_NOREFORK);
});
