/*
  USAGE:

  const { utils } = require("@ludekarts/task-runner");
  const { parseParmas } = utils;
  . . .

  // $ node index.js --a 1 --b

  const [a, b, c] = parseParmas(process.argv.slice(2), "--a", "--b", "--c");

  console.log(a, b, c); // 1 true undefined

*/

function parseParmas(params, ...flags) {
  if (!Array.isArray(params)) {
    throw new Error("Cannot parse params. Params must be an array");
  }
  params.unshift(undefined);
  return flags.map((flag) => {
    const index = params.indexOf(flag);
    const value = params[index + 1];
    return index < 0 ? undefined : value || true;
  });
}

module.exports.utils = {
  parseParmas,
};
