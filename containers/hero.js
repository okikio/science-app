let _src = require("./src");
let _alt = require("./alt");

// Shared similarites between hero containers
module.exports = function(src, alt) {
    return { "hero": { ..._src(src), ..._alt(alt) } };
};
