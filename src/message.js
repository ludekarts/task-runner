const readline = require("readline");

function infoMesage(message) {
  console.log("\x1b[36m%s\x1b[0m", message);
}

function errorMesage(message) {
  console.log("\x1b[31m%s\x1b[0m", message);
}

function successMesage(message) {
  console.log("\x1b[32m%s\x1b[0m", message);
}

function warningMesage(message) {
  console.log("\x1b[33m%s\x1b[0m", message);
}

async function inputMessae(question, defaultValue) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const promptedQuestion = !defaultValue
      ? `${question} `
      : `${question} (${defaultValue}) `

    rl.question(promptedQuestion, function (answer) {
      rl.close();
      resolve(answer ? answer : (defaultValue || ""));
    });

  });
}

module.exports.message = {
  info: infoMesage,
  error: errorMesage,
  input: inputMessae,
  success: successMesage,
  warning: warningMesage,
};