let { map } = require("underscore");
let layer = require("./layer");

// Shared similarites between content containers
module.exports = function(...args) {
    return {
        "content": {
            "layers": map(args, function (val) {
                return typeof val == "object" ? val : layer(val);
            }),
        }
    };
};
