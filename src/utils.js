function parseParmas(params, ...flags) {
  if (!Array.isArray(params)) {
    throw new Error("Cannot parse params. Params must be an array");
  }
  params.unshift(undefined);
  return flags.map(flag => params[params.indexOf(flag) + 1]);
}

module.exports.utils = {
  parseParmas,
};
