var pick = require("../util/pick");

// Shared similarites between alt containers
module.exports = function(alt) {
    return { "alt":  pick(alt, "An iamge of a bustling city.") };
};
