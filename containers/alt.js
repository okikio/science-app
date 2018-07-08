var _ = require("underscore");
let pick = require("../util/pick");

// Shared similarites between alt containers
module.exports = function(alt) {
    var value = { "alt":  pick(alt, "An iamge of a bustling city.") };
    return _.extend({}, value);
};
