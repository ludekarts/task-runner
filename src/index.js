const fs = require("fs");
const path = require("path");
const util = require("util");
const readline = require("readline");
const exec = util.promisify(require("child_process").exec);


async function TaskRunner(tasks) {
  const tasksNames = Object.keys(tasks);
  const onlyTask = tasks.only && Object.keys(tasks.only)[0];

  try {
    if (onlyTask) {
      await runSingleTest(onlyTask, tasks.only).catch(errorMesage);
    } else {
      for (let i = 0, l = tasksNames.length; i < l; i++) {
        const taskName = tasksNames[i];
        await runSingleTest(taskName, tasks).catch(errorMesage);
      }
    }
  } catch (error) {
    errorMesage(error);
  }
}

async function runSingleTest(taskName, tasks) {
  if (taskName === "only") return;
  inlineMessage(`\nRunnig task `);
  infoMesage(taskName);
  return await tasks[taskName]();
}

async function step(name, executeFunction, config = {}) {
  const okMessage = config.success || "✔";
  // Setting "error" flag to TRUE causes that exception rised in the task will be reported as a regular stack trace.
  // If passed string the string value will be presented. In any other case string "✘" will display.
  const errMessage = config.error === true
    ? null
    : typeof config.error === "string"
      ? config.error
      : "✘";

  inlineMessage(`${name} - `);

  try {
    await executeFunction();
  } catch (error) {
    throw errMessage || error;
  }
  successMesage(okMessage);
}

async function execCommand(command, showWarnings = false) {
  let result;
  try {
    const { stdout, stderr } = await exec(command);
    result = stdout;
    showWarnings && warningMesage(stderr);

  } catch (error) {
    throw error;
  }
  return result;
}


// ---- Messages ----------------

async function prompterMessage(question, defaultValue) {
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
      resolve(!answer || !answer.length ? defaultValue : answer);
    });

  });
}

function inlineMessage(message) {
  process.stdout.write(message);
}

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


// ---- Read/Write Files ----------------

function createReadFile(isJson = false) {
  return function readFile(url) {
    const location = path.join(process.cwd() + url);
    const content = fs.readFileSync(location, { encoding: "utf8" });
    return isJson ? JSON.parse(content) : content;
  }
}

function createSaveFile(isJson = false) {
  return function saveFile(url, data) {
    const destination = path.join(process.cwd() + url);
    const content = isJson ? JSON.stringify(data) : data;
    fs.writeFileSync(destination, content.trim());
  }
}



// ---- API ----------------

const message = {
  info: infoMesage,
  error: errorMesage,
  inline: inlineMessage,
  success: successMesage,
  prompter: prompterMessage,
};

const file = {
  save: createSaveFile(),
  read: createReadFile(),
  readJson: createReadFile(true),
  saveJson: createSaveFile(true),
};

module.exports = {
  TaskRunner, step, execCommand, message, file
};