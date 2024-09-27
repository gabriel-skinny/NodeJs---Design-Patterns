import { TaskPromiseQueue } from "./taskPromiseQueue.js";

const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;
const runningMode = process.argv[4] || "non-concurrency";
const linksPerNest = Number.parseInt(process.argv[5]) || 1;
const concurrencyTaskQueueLevel = Number.parseInt(process.argv[6]) || 2;

let spider;

switch (runningMode) {
  case "non-concurrency": {
    let { spider: spiderFunc } = await import(
      "./spider-api-sequential-promise.js"
    );
    spider = spiderFunc;
    break;
  }
  case "concurrency-unlimited": {
    let { spider: spiderFunc } = await import(
      "./spider-api-concurrent-promise.js"
    );
    spider = spiderFunc;
    break;
  }
  case "concurrency-limited": {
    let { spider: spiderFunc } = await import(
      "./spider-api-concurrent-with-limit.js"
    );
    spider = spiderFunc;
    break;
  }
  case "concurrency-with-global-queue": {
    let { spider: spiderFunc } = await import(
      "./spider-api-concurrent-global.js"
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

let taskQueue;

if (runningMode == "concurrency-with-global-queue") {
  taskQueue = new TaskPromiseQueue(concurrencyTaskQueueLevel);
}

spider(url, nesting, linksPerNest, taskQueue)
  .then(({ spideredUrls, downloadedFiles }) => {
    console.log("\n-----SUCESS SPIDERED -----");
    console.log(
      `With arguments "Nesting: ${nesting}", LinksPerNest: ${linksPerNest}`
    );
    console.log(
      `Downloaded ${downloadedFiles} files and spidered ${spideredUrls}`
    );
  })
  .catch((err) => {
    console.log("\n-----ERROR ON SPIDERING-----");
    console.log(`Error: ${err}`);
  })
  .finally(() => {
    console.log("\nFulfilled Time in ms: ", Date.now() - start);
  });

console.log("RUNNING...");
