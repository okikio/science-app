var _ = require("underscore");

// Choose the defined value in a list of 2 values
module.exports = function(val1, val2) {
    return _.isUndefined(val1) ? val2 : val1;
};