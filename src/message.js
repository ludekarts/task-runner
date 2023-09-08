const readline = require("readline");

function infoMessage(message) {
  console.log("\x1b[36m%s\x1b[0m", message);
}

function errorMessage(message) {
  console.log("\x1b[31m%s\x1b[0m", message);
}

function successMessage(message) {
  console.log("\x1b[32m%s\x1b[0m", message);
}

function warningMessage(message) {
  console.log("\x1b[33m%s\x1b[0m", message);
}

async function inputMessage(question, defaultValue) {
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
  info: infoMessage,
  error: errorMessage,
  input: inputMessage,
  success: successMessage,
  warning: warningMessage,
};