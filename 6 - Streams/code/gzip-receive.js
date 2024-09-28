import { createServer } from "http";
import { createWriteStream } from "fs";
import { createGunzip } from "zlib";
import { basename, join } from "path";

const server = createServer((req, res) => {
  const filename = basename(req.headers["x-filename"]);
  const destFilename = join("code", "received_files", filename);
  console.log(`File request received: ${filename}`);

  req
    .pipe(createGunzip())
    .pipe(createWriteStream(destFilename))
    .on("drain", () => {
      console.log("Drain");
    })
    .on("finish", () => {
      res.writeHead(201, { "Content-Type": "text/plain" });
      res.end("Ok\n");
      console.log(`File saved: ${destFilename}`);
    });
});

server.listen(3000, () => {
  console.log("Server listen on port 3000");
});
