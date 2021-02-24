const spawn = require("cross-spawn");
const { message } = require("./message");

async function TaskRunner(tasks, config = {}) {
  const { selectiveList, showErrorReport = false } = config;
  const tasksNames = Object.keys(tasks);
  const results = shouldRunAllTasks(selectiveList)
    ? await executeTasks(tasksNames, tasks)
    : await executeTasks(selectiveList, tasks);

  if (showErrorReport) {
    !results.length
      ? message.success("No errors occured!")
      : (message.error("Error Report:"), console.log(results));
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
  message.info(`Running task: ${title}`);
  try {
    const result = await taskFunction();
    message.success(`${title}: completed ✔`);
    return result;
  } catch (error) {
    message.error(`${title}: failed ✖`);
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

module.exports = {
  runCommand,
  TaskRunner,
};