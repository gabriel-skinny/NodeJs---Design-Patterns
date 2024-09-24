import fs, { link } from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { getPageLinks, urlToFilename } from "./utils.js";

const mutualExcludeUrl = new Set();

export function spider(url, nesting, cb) {
  const filename = urlToFilename(url);

  if (mutualExcludeUrl.has(url)) {
    return process.nextTick(cb);
  }
  mutualExcludeUrl.add(url);

  fs.readFile(filename, "utf-8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }

      return dowloadFromUrl(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

        mutualExcludeUrl.delete(url);
        spiderLinks(url, requestContent, nesting, cb);
      });
    }

    spiderLinks(url, fileContent, nesting, cb);
  });
}

function dowloadFromUrl(url, filename, cb) {
  superagent.get(url).end((err, res) => {
    if (err) return cb(err);

    saveFile(filename, res, (err, filename) => {
      if (err) return cb(err);
      cb(null, filename);
    });
  });
}

function saveFile(filename, res, cb) {
  mkdirp(path.dirname(filename), (err) => {
    if (err) {
      return cb(err);
    }

    fs.writeFile(filename, res.text, (err) => {
      if (err) {
        return cb(err);
      }
      cb(null, filename, true);
    });
  });
}

function spiderLinks(currentUrl, body, nesting, cb) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);
  if (links.length === 0) {
    return process.nextTick(cb);
  }

  let executedCount = 0;
  let hasErrors = false;

  for (const link of links) {
    spider(link, nesting - 1, (err) => {
      if (err) {
        hasErrors = true;
        return cb(err);
      }

      executedCount++;
      if (executedCount === links.length && !hasErrors) {
        return cb();
      }
    });
  }
}
