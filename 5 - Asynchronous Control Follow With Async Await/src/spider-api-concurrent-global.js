import fs, { link } from "fs";
import path, { resolve } from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { getPageLinks, urlToFilename } from "./utils.js";
import { promisify } from "util";

const fsReadFilePromise = promisify(fs.readFile);
const fsWriteFilePromise = promisify(fs.writeFile);
const mkdirpPromisse = promisify(mkdirp);

let spideredUrls = 0;
let downloadedFiles = 0;

export function spider(url, nesting, linksPerNest, queue) {
  return new Promise((resolve, reject) => {
    const filename = urlToFilename(url);

    console.log("\n----START SPIDERING----");
    console.log({ url, filename });

    fsReadFilePromise(filename, "utf-8")
      .catch((err) => {
        if (err.code !== "ENOENT") {
          return cb(err);
        }

        downloadedFiles++;
        return dowloadFromUrl(url, filename);
      })
      .then((fileContent) => {
        return spiderLinks(url, fileContent, nesting, linksPerNest, queue);
      })
      .then(() => {
        console.log(`Resolved spidered for url: ${url}`);
        spideredUrls++;
        resolve({ spideredUrls, downloadedFiles });
      })
      .catch(reject);
  });
}

function dowloadFromUrl(url, filename) {
  let content;

  return superagent
    .get(url)
    .then((res) => {
      content = res.text;
      return mkdirpPromisse(path.dirname(filename));
    })
    .then(() => {
      return fsWriteFilePromise(filename, content);
    })
    .then(() => {
      return content;
    });
}

function spiderLinks(currentUrl, body, nesting, linksPerNest, queue) {
  let promise = Promise.resolve();

  console.log("\n-----SPIDER LINKS------");
  console.log({ url: currentUrl, nesting, linksPerNest });

  if (nesting === 0) {
    return promise;
  }

  const links = getPageLinks(currentUrl, body);
  const filtredLinks = links.slice(0, linksPerNest);

  console.log({ baseUrl: currentUrl, filtredLinks });
  if (filtredLinks.length === 0) {
    return promise;
  }

  let promiseTasks;
  filtredLinks.forEach((link) => {
    promiseTasks = queue.pushTask(() => {
      return spider(link, nesting - 1, linksPerNest, queue);
    });
  });

  console.log("All links promissed!");

  return promiseTasks;
}
