import fs, { link } from "fs";
import path from "path";
import superagent from "superagent";
import mkdirp from "mkdirp";
import { getPageLinks, urlToFilename } from "./utils.js";
import TaskQueue from "./taskQueue.js";

const mutualExcludeUrl = new Set();
let urlsDownloaded = 0;
let totalSpideredUrls = 0;

export function spider(url, nesting, linksPerNest, queue) {
  console.log("\n----SPIDER FUNC--------");

  if (mutualExcludeUrl.has(url)) {
    console.log("SKIPED URL: " + url);
    return;
  }
  mutualExcludeUrl.add(url);

  console.log("----TASK PUSHED-----");
  console.log({ url });
  queue.pushTask((doneCb) => {
    spiderTask(url, nesting, linksPerNest, queue, doneCb);
  });
}

function spiderTask(url, nesting, linksPerNest, queue, doneTaskCb) {
  const filename = urlToFilename(url);

  console.log("\n----SPIDER TASK FUNC----");
  console.log({ url, filename });

  totalSpideredUrls++;
  fs.readFile(filename, "utf-8", (err, fileContent) => {
    if (err) {
      if (err.code !== "ENOENT") {
        return doneTaskCb(err);
      }

      return dowloadFromUrl(url, filename, (err, fileText) => {
        if (err) {
          return doneTaskCb(err);
        }

        urlsDownloaded++;
        spiderLinks(url, fileText, nesting, linksPerNest, queue);

        doneTaskCb(null, urlsDownloaded, totalSpideredUrls);
      });
    }

    spiderLinks(url, fileContent, nesting, linksPerNest, queue);

    doneTaskCb(null, urlsDownloaded, totalSpideredUrls);
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

function spiderLinks(currentUrl, body, nesting, linksPerNest, queue) {
  if (nesting === 0) {
    return;
  }

  const links = getPageLinks(currentUrl, body);
  const linksFormated = links.slice(0, linksPerNest);

  console.log({ linksFormated, currentUrl, nesting });

  if (linksFormated.length === 0) {
    return;
  }

  for (const link of linksFormated) {
    console.log("\nLINK TO SPIDER\n", { baseUrl: currentUrl, link });
    spider(link, nesting - 1, linksPerNest, queue);
  }

  console.log("LINKS SENT TO SPIDER!");
}
