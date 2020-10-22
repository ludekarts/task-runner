# Task runner
Tool for executing series of system tasks with console reporting


## Usage

1. Install with npm:

```
npm install @ludekarts/tasks-runner --save-dev
```

2. Create *task.js* file and import *task-runner* e.g.:

```
echo 'const { TaskRunner, step, execCommand } = require("@ludekarts/task-runner");' > tasks.js
```

3. Add your first task

```
const tasks = {};

tasks.chcekIfPHPExist async function () {
  await step(" - Check for PHP", () => execCommand("php -v"));  
};

TaskRunner(tasks);
```

4. Execute tasks script thorugh system terminal

```
> node tasks.js
```

5. Expeceted result

```
Runnig task chcekIfPHPExist
 - Check for PHP - ✔
```

## API Reference

- TaskRunner(tasks: Object) - ...
- step(message: String, executeFn: Function, config: Object) -> Promise - ... 
- execCommand(systemCommand: String) -> stdout: String - ...
- message: 
    - info(message: String) - ...
    - error(message: String) - ...
    - inline(message: String) - ...
    - success(message: String) - ...
    - prompter(message: String) -> userInput: String - ...
- file:
    - save (path: String, content: String) - ...
    - read (path: String) -> content: String - ...
    - saveJson(path: String, json: Object) - ...
    - readJson(path: String) -> json: Object - ...