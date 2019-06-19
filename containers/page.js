let { extend } = require("underscore");
let title = require("./title");
let tabs = require("./tabs");
let tab_focus = require("./tab-focus");
let footbar = require("./footbar");
let hero = require("./hero");
let content = require("./content");
let css = require("./css");
let js = require("./js");

// Shared similarites between page containers
let fn = function(...args) {
    let defaults = { ...title(), ...tabs(), ...tab_focus(), ...footbar(), ...hero(), ...content(), ...css(), ...js() };
    let containers = extend(...[{}].concat(args));
    return { ...defaults, ...containers };
};

extend(fn, {
    "page": fn,
    "title": title,
    "tabs": tabs,
    "tab_focus": tab_focus,
    "footbar": footbar,
    "hero": hero,
    "content": content,
    "css": css,
    "js": js,

    "layer": require("./layer"),
    "details": require("./details"),
    "src": require("./src"),
    "tile": require("./tile"),
    "img": require("./img"),
});

module.exports = fn;