# Task runner
Small utility for executing series of tasks with console reporting.


## Usage

1. Install with npm:

    ```
    npm install @ludekarts/task-runner --save-dev
    ```

1. Create `task.js` file and import **task-runner** e.g.:

    ```
    echo 'const { TaskRunner, runCommand } = require("@ludekarts/task-runner");' > tasks.js
    ```

1. Add your first tasks collection and add first task

    ```
    const tasksCollection = {};

    tasksCollection.checkNpmVersion = async function () {
      const npmVersion = await runCommand("npm -v", true);
      if (!/^\d+\.\d+\.\d+/.test(npmVersion)) {
        throw new Error("No NPM! 😱");
      }
    };

    TaskRunner(tasksCollection, { showErrorReport: true });
    ```

1. Execute `tasks.js` script thorugh system terminal

    ```
    > node tasks.js
    ```

1. Expeceted result

    ```
    Running task: npmVersion
    npmVersion: completed ✔
    No errors occured!
    ```

### How to run only some tasks?

1. Create new `toolbox.js` file:

1. Add following code to the file:
    ```
    const { TaskRunner, runCommand } = require("@ludekarts/task-runner");

    const selectiveList = process.argv.slice(2);

    const tasks = {
      async taskNameOne() {
        await runCommand("echo runing:taskNameOne");
      },

      async taskNameTwo() {
        await runCommand("echo runing:taskNameTwo");
      },
    }

    TaskRunner(tasks, { selectiveList, showErrorReport: true });
    ```
1. Run only tasks you want like this:
    ```
    > node toolbox.js taskNameTwo
    ```


### How to combine NPM scripts and taskRunner?

1. Create new `builder.js` file:

1. Add following code to the file:
    ```
    const { runCommand, message } = require("@ludekarts/task-runner");

    (async function builder(task, platform) {
      switch (task) {

        case "development":
          await runCommand(`cross-env NODE_PLATFORM=${platform} webpack serve --mode development`);
          break;

        default:
          message.error(`Unknown task: ${task}`);
          break;

      }
    }(...process.argv.slice(2)));
    ```

1. Add new script to your *package.json* file e.g:
    ```
    "scripts": {
      "builder": "node ./builder.js"
    },
    ```

1. Run npm script like this:

    ```
    npm run builder -- development desktop
    ```

## API Reference

- **TaskRunner(** tasksCollection: Object, { selectiveList: Array (undefined), showErrorReport: Boolean(false)} **)** - Run all tasks from given *tasksCollection*. Each task is called asynchronous. If *showErrorReport* flag set to TRUE at the end user will be presented with full Error Report. By passing to *selectiveList* array of tasks to run user can specify which task should run. Best way to utilize this feature is to connect it to *precess.args* e.g.:
    ```
    const selectiveList = process.argv.slice(2);
    TaskRunner(tasks, { selectiveList, showErrorReport: true });
    ``` 
    Thank to this user can call script with names of tasks to run e.g.:

    ```
    > node tasks.js taskNameOne taskNameTwo
    ```

- **runCommand(** systemCommand: String, resolveWithData: Boolean(false) **)** -> Promise() - Allows user to run system commands. Returns promise that resolves by default with *exit code* or stringified buffer data if *resolveWithData* flag is set. If method resolves with data the output of the method will no be present in the console instead it will be returned as the promise result.

- **message** (sync methods): 
    - **info(** message: String **)** - Output blue text to the console.
    - **error(** message: String **)** - Output red text to the console.
    - **success(** message: String **)** - Output green text to the console.
    - **warning(** message: String **)** - Output orange text to the console.
    - **input(** message: String, defaultValue: String **)** -> take userInput: String -> Promise() - Display Message and take user input.
- **file** (sync methods):
    - **save (** path: String, content: String **)** - Save file under given path.
    - **read (** path: String **)** -> content: String - Read file from given path.
    - **saveJson(** path: String, json: Object **)** - Save JSON file under given path.
    - **readJson(** path: String **)** -> json: Object - Read JSON file from given path.
    - **crawler(**directory: String, processing: function **)** -> Walk through given directory, and precess each file with processing fn.