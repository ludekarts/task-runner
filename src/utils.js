/*
  USAGE:

  const { utils } = require("@ludekarts/task-runner");
  const { parseParams } = utils;
  . . .

  // $ node index.js -a 1 -b -d

  const [a, b, c, d] = parseParams(process.argv.slice(2), "-a", "-b", "-c", "-d");

  console.log(a, b, c, d); // 1 true undefined true

*/

function parseParams(params, ...flags) {
  if (!Array.isArray(params)) {
    throw new Error("Cannot parse params. Params must be an array");
  }
  params.unshift(undefined);
  return flags.map((flag) => {
    const index = params.indexOf(flag);
    const value = params[index + 1];
    return index < 0
      ? undefined
      : value
      ? flags.includes(value)
        ? true
        : value
      : true;
  });
}

module.exports.utils = {
  parseParams,
};
