var createError = require('http-errors');
var express = require('express');
var http = require("http");
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var _ = require("underscore");
var compress = require('compression');
var fs = require("fs");
var staticify = require('staticify')(path.join(__dirname, 'public'));

// List of routers 
var Router = require('./util/router');
var app = express();

// List of routes and routers
var routes = require("./render.min")["route"];
var routeList = routes["routes"];
var errors = routes["errors"];


app.locals = {
    getVersionedPath: staticify.getVersionedPath
};

// _cache();
// Compress/GZIP Server
app.use(compress());
app.use(staticify.middleware);
app.use(function(req, res, next) {
    req.url = req.url.replace(/\/([^\/]+)\.[0-9a-f]+\.(css|js|jpg|png|gif|svg|cache)$/, '/$1.$2');
    next();
});
app.use(express.static(path.join(__dirname, 'public'), { maxAge: '30 days' }));
app.get("/app.cache", function(req, res) {
    res.header("Content-Type", "text/cache-manifest");
    res.end("CACHE MANIFEST");
});

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.set('view cache', true);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Set route to routers 
_.each(routeList, function(_router, route, obj) {
    app.use(route, Router(_router));
});

// Set route to routers (for errors)
_.each(errors, function(_router, route, obj) {
    // Catch error and forward to error handler
    app.use(function(req, res, next) {
        next(createError(Number(route)));
    });

    // Error handler
    app.use(function(err, req, res, next) {
        // Render the error page
        res.status(err.status || 500);
        res.render('error', _router);
    });
});

function _cache () {
    var filesToCache = [
            '/',
            '/about',
            '/health-policies-and-tech',
            '/connections',
            '/references'
        ]
        .concat(
            map_cache("/images"),
            map_cache("/js"),
            map_cache("/css"),
            map_cache("/fonts"));
    
    function map_cache(path) {
        var _path = __dirname + "/public" + (path + "");
        const filesNames = fileList(_path, path + "/");
        return filesNames
    }
    
    function fileList(dir, _path) {
        let path_ = _path || "";
        return fs.readdirSync(dir).reduce(function(list, file) {
            var name = path.join(dir, file);
            var isDir = fs.statSync(name).isDirectory();
            return list.concat(isDir ? fileList(name, _path + file + "/") : [_path + file]);
        }, []);
    }
    
    var begin = ['CACHE MANIFEST', '#v0.0.2 change this to force update\n', '# Cache', 'CACHE:\n'].join("\n");
    var end = ['\n\nNETWORK:', '*\n', 'FALLBACK:', '/ /'].join("\n");
    fs.writeFile(__dirname + '/public/app.cache', (begin + filesToCache.join('\n') + end), function(err) {
        if (err) { throw err; }
    });
    
    fs.writeFile(__dirname + '/client/js/cachelist.js', "var filesToCache = " + JSON.stringify(filesToCache) + ";", function(err) {
        if (err) { throw err; }
    });
}

module.exports = app;
