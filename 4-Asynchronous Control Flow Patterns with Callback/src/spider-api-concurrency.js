import fs, { link } from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { getPageLinks, urlToFilename } from "./utils.js";

const mutualExcludeUrl = new Set();

export function spider(url, nesting, linksPerNest, cb) {
  const filename = urlToFilename(url);

  if (mutualExcludeUrl.has(url)) {
    return process.nextTick(cb);
  }
  mutualExcludeUrl.add(url);

  console.log({ url, filename });

  fs.readFile(filename, "utf-8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return cb(err);
      }

      return dowloadFromUrl(url, filename, (err, fileText) => {
        if (err) {
          return cb(err);
        }

        spiderLinks(url, fileText, nesting, linksPerNest, (err) => {
          if (err) return cb(err);

          cb(null, url, true);
        });
      });
    }

    spiderLinks(url, fileContent, nesting, linksPerNest, (err) => {
      if (err) return cb(err);

      cb(null, url, false);
    });
  });
}

function dowloadFromUrl(url, filename, cb) {
  superagent.get(url).end((err, res) => {
    if (err) return cb(err);

    saveFile(filename, res, (err, filename) => {
      if (err) return cb(err);
      if (!res.text) return cb(new Error("Text does not exists"));
      cb(null, res.text);
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
      cb(null, filename);
    });
  });
}

function spiderLinks(currentUrl, body, nesting, linksPerNest, cb) {
  if (nesting === 0) {
    return process.nextTick(cb);
  }

  const links = getPageLinks(currentUrl, body);
  const linksFormated = links.slice(0, linksPerNest);

  console.log({ linksFormated, currentUrl });

  if (linksFormated.length === 0) {
    return process.nextTick(cb);
  }

  let executedCount = 0;
  let hasErrors = false;

  for (const link of linksFormated) {
    spider(link, nesting - 1, linksPerNest, (err) => {
      if (err) {
        hasErrors = true;
        return cb(err);
      }

      executedCount++;
      if (executedCount === linksFormated.length && !hasErrors) {
        return cb();
      }
    });
  }
}
