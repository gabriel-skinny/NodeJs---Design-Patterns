import { Writable } from "node:stream";
import { mkdirp } from "mkdirp";
import { dirname } from "node:path";
import fs from "fs/promises";
import path from "path";

export class ToFileStream extends Writable {
  constructor(options) {
    super({ ...options, objectMode: true });
  }

  _write(chunk, encoding, cb) {
    console.log(`Writing content to: ${chunk.path}`);
    mkdirp(dirname(chunk.path))
      .then(() => {
        return fs.writeFile(chunk.path, chunk.content);
      })
      .then(() => cb())
      .catch(console.error);
  }
}

const fileStream = new ToFileStream();

fileStream.write({
  path: path.join("code", "data", "teste-write.txt"),
  content: "My streamed content",
});

fileStream.write({
  path: path.join("code", "data", "teste-write2.txt"),
  content: "My streamed content2",
});

fileStream.end(() => console.log("All files created"));
