let pick = require("../util/pick");

// Shared similarites between tab-focus containers
module.exports = function(tab) {
    return { "tab_focus": pick(tab, "Focus") };
};
