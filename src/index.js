const fs = require("fs");
const path = require("path");
const readline = require("readline");
const spawn = require("cross-spawn");

async function TaskRunner(tasks, config = {}) {
  const { selectiveList, showErrorReport = false } = config;
  const tasksNames = Object.keys(tasks);
  const results = shouldRunAllTasks(selectiveList)
    ? await executeTasks(tasksNames, tasks)
    : await executeTasks(selectiveList, tasks);

  if (showErrorReport) {
    !results.length
      ? successMesage("No errors occured!")
      : (errorMesage("Error Report:"), console.log(results));
  }

  return results;
};

function shouldRunAllTasks(selectiveList) {
  return !selectiveList || !Array.isArray(selectiveList) || !selectiveList.length;
}

async function executeTasks(tasksNames, tasks) {
  const results = [];
  for (let i = 0, l = tasksNames.length; i < l; i++) {
    const taskName = tasksNames[i];
    const taskFunction = tasks[taskName];
    const result = await task(taskName, taskFunction);
    result && result.error && results.push(result);
  }
  return results;
}

async function task(title, taskFunction) {
  infoMesage(`Running task: ${title}`);
  try {
    const result = await taskFunction();
    successMesage(`${title}: completed ✔`);
    return result;
  } catch (error) {
    errorMesage(`${title}: failed ✖`);
    return { title, error };
  }
}

function runCommand(commandString, resolveWithData = false) {
  const [command, ...args] = commandString.split(" ");
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, [...args], { stdio: resolveWithData ? "pipe" : "inherit" });
    let buffer = "";
    resolveWithData &&
      childProcess.stdout.on("data", data => buffer += data.toString());
    childProcess.on("close", code => resolve(resolveWithData ? buffer.trim() : code));
    childProcess.on("error", error => reject(error));
  });
}

// ---- Messages ----------------

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

const message = {
  info: infoMesage,
  error: errorMesage,
  input: inputMessae,
  success: successMesage,
  warning: warningMesage,
};

// ---- Read/Write Files ----------------

function createReadFile(isJson = false) {
  return function readFile(url) {
    const location = path.join(process.cwd() + url);
    const content = fs.readFileSync(location, { encoding: "utf8" });
    return isJson ? JSON.parse(content) : content;
  }
}

function createSaveFile(isJson = false) {
  return function saveFile(url, data, override = true) {
    const destination = path.join(process.cwd() + url);
    const content = isJson ? JSON.stringify(data) : data;
    fs.writeFileSync(destination, content.trim(), { flag: override ? "w" : "wx" });
  }
}

const file = {
  save: createSaveFile(),
  read: createReadFile(),
  readJson: createReadFile(true),
  saveJson: createSaveFile(true),
};


// ---- API ----------------

module.exports = {
  TaskRunner,
  runCommand,
  message,
  file,
};
