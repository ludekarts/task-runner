const fs = require("fs");
const path = require("path");

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
  return fs.readdirSync(directory).reduce((files, file) => {
    const fullPath = path.join(directory, file);
    const isDirectory = fs.statSync(fullPath).isDirectory();

    // Collect files.
    if (!processing)
      return isDirectory
        ? [...files, ...crawler(fullPath, processing)]
        : [...files, fullPath];

    // Process directories.
    if (isDirectory)
      return processing(directory, true)
        ? [...files, ...crawler(fullPath, processing)]
        : files;

    // Process files.
    const result = processing(fullPath);
    return result ? [...files, result] : files;
  }, []);
}

module.exports.file = {
  crawler: crawler,
  save: createSaveFile(),
  read: createReadFile(),
  readJson: createReadFile(true),
  saveJson: createSaveFile(true),
};