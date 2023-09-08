const fs = require("fs");
const path = require("path");

function createReadFile(isJson = false) {
  return function readFile(url, isAbsolute = false) {
    const normalizeUrl = url.includes(path.sep) ? url : `${path.sep}${url}`;
    const location = isAbsolute ? normalizeUrl : path.join(process.cwd() + normalizeUrl);
    const content = fs.readFileSync(location, { encoding: "utf8" });
    return isJson ? JSON.parse(content) : content;
  }
}

function createSaveFile(isJson = false) {
  return function saveFile(url, data, options = {}) {
    const { override = true, isAbsolute = false } = options;
    const normalizeUrl = url.includes(path.sep) ? url : `${path.sep}${url}`;
    const destination = isAbsolute ? normalizeUrl : path.join(process.cwd() + normalizeUrl);
    const content = isJson ? JSON.stringify(data) : data;
    const directory = destination.slice(0, destination.lastIndexOf(path.sep));
    fs.mkdirSync(directory, { recursive: true });
    fs.writeFileSync(destination, content.trim(), { flag: override ? "w" : "a" });
  }
}

/*
  Walks through the given directory collectiong all files.
  Additionally processing fn can be passed as second argument.
  This fn recieves file path as an arg, and it should return it back after processing.
  If fn returns falsy value the file will not be added to the final array.
*/

// const processing = (path, isDirectory) => [path | bool];
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
    }

    else {
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