import fs from "fs";

function concatFiles(dest, cb, ...sourceFiles) {
  console.log("---RUNNING CONCAT FILES ----");
  console.log({ sourceFiles });

  let stringToWrite = "";
  let writtenFileCount = 0;
  let sourceIndex = 0;
  function write() {
    const source = sourceFiles[sourceIndex];

    fs.readFile(source, "utf-8", (err, data) => {
      if (err) return cb(err);

      stringToWrite += data;
      writtenFileCount++;
      console.log(
        `Source Written: ${source} -- Written count: ${writtenFileCount} -- Source Index: ${sourceIndex}`
      );
      if (sourceIndex == sourceFiles.length - 1) {
        return fs.createWriteStream(dest).write(stringToWrite, (err) => {
          if (err) return cb(err);

          cb();
        });
      }

      sourceIndex++;
      write();
    });
  }

  write();
}

concatFiles(
  "./data/result.txt",
  (err) => {
    if (err) console.log("Error on Concating files: " + err);
    else console.log("\n ----FINISHED---\n Data Written");
  },
  "./data/bigFile.txt",
  "./data/foo.txt",
  "./data/anotherSmallFile.txt",
  "./data/bar.txt"
);
