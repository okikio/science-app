// Shared similarites between tab containers
module.exports = function(...args) {
    return {
        "tabs": args.length == 0 ? ["About", "Health Policies & Tech", "Connections", "References"] : args
    };
};
