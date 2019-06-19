let pick = require("../util/pick");

// Shared similarites between title
module.exports = function(title) {
    return { "title": pick(title, "Page") };
};
