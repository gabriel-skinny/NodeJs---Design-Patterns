import { EventEmitter } from "node:events";
import { readFile } from "node:fs";

class FindRegex extends EventEmitter {
  constructor(regex) {
    super();
    this.regex = regex;
    this.files = [];
  }

  addFile(file) {
    this.files.push(file);
    return this;
  }

  find() {
    process.nextTick(() => this.emit("files", this.files));
    for (const file of this.files) {
      readFile(file, "utf-8", (err, content) => {
        if (err) {
          return this.emit("error", err);
        }

        this.emit("fileread", file);

        const match = content.match(this.regex);
        if (match) {
          match.forEach((elem) => this.emit("found", file, elem));
        }
      });
    }

    return this;
  }
}

const findRegex = new FindRegex(/hello \w+/g);

findRegex.addFile("./data/fileA.txt");
findRegex.addFile("./data/fileB.json");
findRegex
  .find()
  .on("files", (files) => console.log(`Sync emit files: ${files}`))
  .on("fileread", (file) => console.log(`File class read: ${file}`))
  .on("match", (file, elem) =>
    console.log(`Element matched ${elem} on file ${file}`)
  );
