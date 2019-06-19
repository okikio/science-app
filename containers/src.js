let pick = require("../util/pick");

// Shared similarites between src containers
module.exports = function(src) {
    return { "src":  pick(src, "/images/city.jpg") };
};
