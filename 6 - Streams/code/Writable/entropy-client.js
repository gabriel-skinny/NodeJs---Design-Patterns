import { createReadStream } from "fs";
import { request } from "http";
import { createGzip } from "zlib";

const httpRequestOptions = {
  hostname: "localhost",
  port: 3000,
  path: "/",
  method: "GET",
  headers: {
    "Content-Type": "plain/text",
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
