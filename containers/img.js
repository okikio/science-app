var _ = require("underscore");
let _src = require("./src");
let _alt = require("./alt");

// Shared similarites between img containers
module.exports = function(src, alt) {
    var value = { "img": _.extend({}, _src(src), _alt(alt)) };
    return _.extend({}, value);
};
