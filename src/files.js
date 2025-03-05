const fs = require("fs");
const path = require("path");

function createReadFile(isJson = false) {
  return function readFile(url, isAbsolute = false) {
    const normalizeUrl = url.includes(path.sep) ? url : `${path.sep}${url}`;
    const location = isAbsolute
      ? normalizeUrl
      : path.join(process.cwd() + normalizeUrl);
    const content = fs.readFileSync(location, { encoding: "utf8" });
    return isJson ? JSON.parse(content) : content;
  };
}

function createSaveFile(isJson = false) {
  return function saveFile(url, data, options = {}) {
    const { override = true, isAbsolute = false } = options;
    const normalizeUrl = url.includes(path.sep) ? url : `${path.sep}${url}`;
    const destination = isAbsolute
      ? normalizeUrl
      : path.join(process.cwd() + normalizeUrl);
    const content = isJson ? JSON.stringify(data) : data;
    const directory = destination.slice(0, destination.lastIndexOf(path.sep));
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(destination, content.trim(), {
      flag: override ? "w" : "a",
    });
  };
}

/*
  Walks through given directory, collecting all files.

  * Additionally processing fn can be passed as second argument.
  This fn recieves file path as an arg, and it should return the path back after processing,
  if fn returns falsy value the path will not be added to the results array.

  USAGE:
  const { file: { crawler } } = require("@ludekarts/task-runner");

  EXAMPLE 1: List all files in given directory.
  const fileList = crawler(".");

  EXAMPLE 2: Exclude node_modules directory from crawling.
  const fileList = crawler(".", (path) => path.includes("node_modules") ? false : path);

  EXAMPLE 3: Collects all files & folders in current directory.
  const listDirectory = [];

  // Since we return "undefined" from processing fn crawler will not "dig" into subdirectories.
  crawler(".", (path, isDirectory) => { listDirectory.push(path) });

  // Collext only files from current directory.
  const listFiles = crawler(".", (path, isDirectory) => isDirectory ? false : path);

*/

// const processing = (path, isDirectory) => path | boolean;
const defaultProcessing = (fullpath, isDirectory) => fullpath;

function crawler(directory, processing = defaultProcessing) {
  if (processing && typeof processing !== "function") {
    throw new Error("Processing argument should be function");
  }

  // Exit with empty array to enable valude destructuring when used in recursive calls.
  if (typeof directory !== "string") return [];

  return fs.readdirSync(directory).reduce((files, file) => {
    const fullPath = path.join(directory, file);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    if (isDirectory) {
      return [...files, ...crawler(processing(fullPath, true), processing)];
    } else {
      const result = processing(fullPath, false);
      return typeof result === "string" ? [...files, result] : files;
    }
  }, []);
}

module.exports.file = {
  crawler: crawler,
  save: createSaveFile(),
  read: createReadFile(),
  readJson: createReadFile(true),
  saveJson: createSaveFile(true),
};
