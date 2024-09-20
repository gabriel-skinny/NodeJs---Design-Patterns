import { EventEmitter } from "node:events";
import { readFile } from "node:fs";

function findRegexFunc(files, regex) {
  const emitter = new EventEmitter();

  for (const file of files) {
    readFile(file, "utf-8", (err, content) => {
      if (err) {
        return emitter.emit("error", err);
      }

      emitter.emit("fileread", file);
      emitter.emit("content", content);
      const match = content.match(regex);
      if (match) {
        match.forEach((elem) => emitter.emit("found", file, elem));
      }
    });
  }

  return emitter;
}

findRegexFunc(["./data/fileA.txt", "./data/fileB.json"], /hello \w+/g)
  .on("fileread", (file) => console.log(`${file} was read`))
  .on("found", (file, elem) =>
    console.log(`Element: ${elem} found on file: ${file}`)
  )
  .on("content", (content) => console.log(`File content: ${content}`))
  .on("error", (err) => console.log(`Error event: ${err}`));

// Object Observable

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
    this.emit("files", this.files);
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
