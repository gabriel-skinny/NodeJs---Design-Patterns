import TaskQueue from "./taskQueue.js";

const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;
const runningMode = process.argv[4] || "non-concurrency";
const linksPerNest = Number.parseInt(process.argv[5]) || 1;
const concurrencyTaskQueueLevel = Number.parseInt(process.argv[6]) || 2;

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

console.log("START: " + Date.now());
const start = Date.now();

const taskQueue = new TaskQueue(concurrencyTaskQueueLevel);
taskQueue.on("empty", () => {
  console.log("\n---Task Queue empty!---");
  console.log(`END TIME: ${Date.now() - start}`);
});
taskQueue.on("result", (urlsDownloaded, totalSpideredUrls) => {
  console.log("\n---RESULT---");
  console.log(
    `With arguments "Nesting: ${nesting}", LinksPerNest: ${linksPerNest}`
  );
  console.log(
    `Total downloaded ${urlsDownloaded} files and spidered ${totalSpideredUrls}`
  );
});

const callBackResult = (err, filename, urlsDownloaded, totalSpideredUrls) => {
  if (err) {
    console.error(err);
  } else {
    console.log(
      `With arguments "Nesting: ${nesting}", LinksPerNest: ${linksPerNest}`
    );
    console.log(
      `From "${filename}" root downloaded ${urlsDownloaded} files and spidered ${totalSpideredUrls}`
    );
  }

  console.log("Time in ms: ", Date.now() - start);
};

const eventOrCallBackResult =
  runningMode == "concurrency-with-global-queue" ? taskQueue : callBackResult;

spider(url, nesting, linksPerNest, eventOrCallBackResult);

console.log("RUNNING...");
