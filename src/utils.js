
/*
  USAGE:

  const { utils } = require("@ludekarts/task-runner");
  const { parseParmas } = utils;
  . . .

  // $ node index.js --a 1 --b 2 --c

  const [a, b, c] = parseParmas(process.argv.slice(2), "--a", "--b", "--c");

  console.log(a, b, c); // 1 2 undefined

*/

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
