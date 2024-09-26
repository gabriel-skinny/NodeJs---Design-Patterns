const url = process.argv[2];
const nesting = Number.parseInt(process.argv[3], 10) || 1;
const runningMode = process.argv[4] || "non-concurrency";
const linksPerNest = Number.parseInt(process.argv[5]) || 1;

let spider;

switch (runningMode) {
  case "non-concurrency": {
    let { spider: spiderFunc } = await import(
      "./spider-api-sequential-promise"
    );
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
  default: {
    throw new Error("Running mode non recognized");
  }
}

console.log("START: " + Date.now());
const start = Date.now();

spider(url, nesting, linksPerNest)
  .then((totalSpideredUrls, urlsDownloaded) => {
    console.log("\n-----SUCESS SPIDERED -----");
    console.log(
      `With arguments "Nesting: ${nesting}", LinksPerNest: ${linksPerNest}`
    );
    console.log(
      `Downloaded ${urlsDownloaded} files and spidered ${totalSpideredUrls}`
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
