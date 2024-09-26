import fs from "fs";

function recursiveFind(directory, contentMatchString, cb) {
  console.log("\n----RECURSIVE FIND ----");
  fs.readdir(directory, (err, files) => {
    if (err) return cb(err);

    console.log({ files });

    const matchedFilesArray = [];
    let readedFiles = 0;
    for (const file of files) {
      fs.readFile(`./${directory}/${file}`, "utf-8", (err, data) => {
        if (err) return cb(err);

        if (data.match(contentMatchString)) {
          matchedFilesArray.push(file);
        }

        readedFiles++;
        if (readedFiles == files.length) {
          cb(null, matchedFilesArray);
        }
      });
    }
  });
}

recursiveFind("data", "bar", (err, data) => {
  if (err) console.log("Error" + err);
  else {
    console.log("\n-----FINISHED SUCESSFULLY---");
    console.log(`Files with matched string: ${data}`);
  }
});
