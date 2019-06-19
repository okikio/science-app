let { map, extend } = require("underscore");
let _src = require("./src");
let _alt = require("./alt");
let _title = require("./title");

// Shared similarites between content containers
module.exports = function(...args) {
    return {
        "tile": extend(...[{}, _src(), _alt(), _title()].concat(
            map(args, function (val) {
                if (typeof val !== "object") return;
                return val;
            })
        ))
    };
};
