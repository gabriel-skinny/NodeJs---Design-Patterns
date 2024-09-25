const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;
const runningMode = process.argv[4] || "non-concurrency";
const linksPerNest = Number.parseInt(process.argv[5]) || 1;

let spider;

switch (runningMode) {
  case "non-concurrency": {
    let { spider: spiderFunc } = await import("./spider-api-refactor.js");
    spider = spiderFunc;
    break;
  }
  case "concurrency-unlimited": {
    let { spider: spiderFunc } = await import("./spider-api-concurrency.js");
    spider = spiderFunc;
    break;
  }
  case "concurrency-limited": {
    let { spider: spiderFunc } = await import(
      "./spider-api-concurrency-with-limit.js"
    );
    spider = spiderFunc;
    break;
  }
  case "concurrency-with-global-queue": {
    let { spider: spiderFunc } = await import(
      "./spider-api-concurrency-with-global-queue.js"
    );
    spider = spiderFunc;
    break;
  }
  default: {
    throw new Error("Running mode non recognized");
  }
}

spider(url, nesting, linksPerNest, (err, filename, downloaded) => {
  if (err) {
    console.error(err);
  } else if (downloaded) {
    console.log(`Completed the download of "${filename}"`);
  } else {
    console.log(`"${filename}" was already downloaded`);
  }
});

console.log("RUNNING...");
