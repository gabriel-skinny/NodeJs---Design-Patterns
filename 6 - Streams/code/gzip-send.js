import { createReadStream } from "fs";
import { request } from "http";
import path, { basename } from "path";
import { createGzip } from "zlib";

const fileName = process.argv[2];
const filePath = `./code/data/${fileName}`;

const httpRequestOptions = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "PUT",
  headers: {
    "Content-Type": "application/octet-stream",
    "Content-Encoding": "gzip",
    "X-Filename": basename(filePath),
  },
};

const req = request(httpRequestOptions, (res) => {
  res.on("data", (data) => {
    console.log(`Response data: ${data}`);
  });
  res.on("end", () => {
    console.log("Response finished");
  });
});

createReadStream(filePath)
  .pipe(createGzip())
  .pipe(req)
  .on("finish", () => {
    console.log("File sended to server");
  });
