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

function runCommand(input, config = {}) {
  const { resolveWithOutput = false, showOutput = false, stdio = "pipe" } = config;
  const [command, ...args] = input
    .replace(/["'](.+?)['"]/g, (_, c) => c.replace(/ /g, "$^$"))
    .split(" ")
    .map(p => p.replace(/\$\^\$/g, " "));

  return new Promise((resolve, reject) => {
    let buffer = "";
    const childProcess = spawn(command, [...args], { stdio });

    childProcess.stdout?.on("data", data => {
      const dataString = data.toString();

      if (showOutput) {
        console.log(dataString);
      }

      if (resolveWithOutput) {
        buffer += dataString;
      }

    });

    childProcess.on("close", code => resolve(resolveWithOutput ? buffer.trim() : code));
    childProcess.on("error", reject);
  });
}

module.exports = {
  runCommand,
  TaskRunner,
};