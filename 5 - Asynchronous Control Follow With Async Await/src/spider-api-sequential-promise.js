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

export function spider(url, nesting, linksPerNest) {
  return new Promise((resolve, reject) => {
    const filename = urlToFilename(url);

    fsReadFilePromise(filename, "utf-8")
      .then(
        (fileContent) => {
          return spiderLinks(url, fileContent, nesting, linksPerNest);
        },
        (err) => {
          if (err.code !== "ENOENT") {
            return cb(err);
          }

          return dowloadFromUrl(url, filename).then((requestContent) => {
            return spiderLinks(url, requestContent, nesting, linksPerNest);
          });
        }
      )
      .then(() => {
        resolve(spideredUrls, downloadedFiles);
      })
      .catch(reject);
  });
}

function dowloadFromUrl(url, filename) {
  return new Promise((resolve, reject) => {
    superagent.get(url).end((err, res) => {
      if (err) return reject(err);

      saveFile(filename, res).then((filename) => {
        resolve(res);
      });
    });
  });
}

function saveFile(filename, res) {
  return mkdirpPromisse(path.dirname(filename))
    .then(() => {
      return fsWriteFilePromise(filename, res.text);
    })
    .then(() => {
      return filename;
    });
}

function spiderLinks(currentUrl, body, nesting, linksPerNest) {
  return new Promise((resolve, reject) => {
    if (nesting === 0) {
      return resolve();
    }

    const links = getPageLinks(currentUrl, body);
    const filtredLinks = links.slice(0, linksPerNest);
    if (filtredLinks.length === 0) {
      return resolve();
    }

    function iterate(index) {
      if (index === filtredLinks.length) {
        return resolve();
      }

      spider(filtredLinks[index], nesting - 1).then(
        () => iterate(index + 1),
        reject
      );
    }

    iterate(0);
  });
}
