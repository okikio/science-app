let pick = require("../util/pick");

// Shared similarites between details containers
module.exports = function(details) {
    return { "details": pick(details, "Details") };
};
