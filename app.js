let debug = require('debug')('app-science:server');
let shrinkRay = require('@magento/shrink-ray');
let cookieParser = require('cookie-parser');
let createError = require('http-errors');
let { each } = require("underscore");
let express = require('express');
let logger = require('morgan');
let helmet = require('helmet');
let path = require('path');
let http = require('http');
let app = express();
let server, port;

// Cache busting setup
let staticify = require('staticify')(path.join(__dirname, 'public'));

// List of routes and routers
let render = require("./render.min");
let routeList = render["route"];
let pageList = render["page"];

// Normalize a port into a number, string, or false.
let normalizePort = val => {
    let port = parseInt(val, 10);
    if (isNaN(port)) { return val; } // Named pipe
    if (port >= 0) { return port; } // Port number
    return false;
};

// Get port from environment and store in Express.
port = normalizePort(process.env.PORT || '8080');// Every 29 minutes

// Local variables
app.locals = {
    getVersionedPath: staticify.getVersionedPath
};

// Protect server
app.use(helmet());

// Compress/GZIP/Brotil Server
app.use(shrinkRay());
app.use(staticify.middleware);
app.use(function(req, res, next) {
    req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg|cache)$/, '/$1.$2');
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: (60 * 60 * 24).toString() }));

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view cache', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Routes and the pages to render
each(routeList, (pageName, url) => {
    app.get(url, (req, res) => {
        let page = pageList[pageName]; // The page to render
        let template = page[1] || "template/page"; // The template to use
        let data = page[0]; // The data to put in the template
        res.render(template, data);
    });
});

// Catch error and forward to error handler
app.use(function(req, res, next) {
    next(createError(Number(404)));
});

// Error handler
app.use(function(err, req, res, next) {
    // Render the error page
    res.status(err.status || 500);
    res.render('error', render["error"]);
});

// Set port
app.set('port', port);

setInterval(function() {
    http.get("https://app-science.herokuapp.com");
}, 1000 * 60 * 29);

// Create HTTP server.
server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);

// Event listener for HTTP server "error" event.
server.on('error', err => {
    if (err.syscall !== 'listen') { throw err; }
    let bind = typeof port === 'string' ?
        'Pipe ' + port : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (err.code) {
        case 'EACCES':
            console.error(bind + ' requires elevated privileges');
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(bind + ' is already in use');
            process.exit(1);
            break;
        default:
            throw err;
    }
});

// Event listener for HTTP server "listening" event.
server.on('listening', () => {
    let addr = server.address();
    let bind = typeof addr === 'string' ?
        'pipe ' + addr :
        'port ' + addr.port;
    debug('Listening on ' + bind);
});