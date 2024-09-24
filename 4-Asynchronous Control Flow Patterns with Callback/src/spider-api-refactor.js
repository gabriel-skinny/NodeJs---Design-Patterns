import fs, { link } from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { getPageLinks, urlToFilename } from "./utils.js";

export function spider(url, nesting, cb) {
  const filename = urlToFilename(url);

  fs.readFile(filename, "utf-8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }

      return dowloadFromUrl(url, filename, (err, requestContent) => {
        if (err) {
          return cb(err);
        }

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

  function iterate(index) {
    if (index === links.length) {
      return cb();
    }

    spider(links[index], nesting - 1, function (err) {
      if (err) {
        return cb(err);
      }
      iterate(index + 1);
    });
  }

  iterate(0);
}
