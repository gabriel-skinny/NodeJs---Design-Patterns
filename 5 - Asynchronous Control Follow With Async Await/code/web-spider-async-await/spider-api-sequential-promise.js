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

export async function spider(url, nesting, linksPerNest) {
  const filename = urlToFilename(url);

  console.log("\n----START SPIDERING----");
  console.log({ url, filename });

  let fileContent;
  try {
    fileContent = await fsReadFilePromise(filename, "utf-8");
  } catch (error) {
    if (err.code !== "ENOENT") {
      return cb(err);
    }

    downloadedFiles++;
    fileContent = await dowloadFromUrl(url, filename);
  }

  await spiderLinks(url, fileContent, nesting, linksPerNest);
  spideredUrls++;

  return { spideredUrls, downloadedFiles };
}

async function dowloadFromUrl(url, filename) {
  const res = await superagent.get(url);

  await mkdirpPromisse(path.dirname(filename));
  await fsWriteFilePromise(filename, res.text);

  return res.text;
}

async function spiderLinks(currentUrl, body, nesting, linksPerNest) {
  console.log("\n-----SPIDER LINKS------");
  console.log({ url: currentUrl, nesting, linksPerNest });

  if (nesting === 0) return;

  const links = getPageLinks(currentUrl, body);
  const filtredLinks = links.slice(0, linksPerNest);

  console.log({ baseUrl: currentUrl, filtredLinks });
  if (filtredLinks.length === 0) return;

  for (const link of filtredLinks)
    await spider(link, nesting - 1, linksPerNest);

  console.log("All links promissed!");
}
