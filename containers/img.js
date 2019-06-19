let _src = require("./src");
let _alt = require("./alt");

// Shared similarites between img containers
module.exports = function(src, alt) {
    return { "img": { ..._src(src), ..._alt(alt) } };
};
