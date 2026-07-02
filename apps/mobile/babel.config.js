const path = require("path");

// Set EXPO_ROUTER_APP_ROOT before the babel plugin runs
process.env.EXPO_ROUTER_APP_ROOT = path.resolve(__dirname, "app");

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};