let pick = require("../util/pick");

// Shared similarites between hero containers
module.exports = function(footbar) {
    return { "footbar":  pick(footbar, true) };
};
