import fs from "fs";

function readJsonFile(filename, cb) {
  fs.readFile(filename, (err, data) => {
    if (err) {
      cb(err);
      return;
    }

    cb(null, JSON.parse(data));
  });
}

try {
  readJsonFile("wrong-json.json", (err, data) => {
    if (err) console.log(`Error callback: ${err}`);
    else console.log(data);
  });
} catch (error) {
  console.log(error);
}

process.on("uncaughtException", (err) => {
  console.error(`Only this can caugth fs stack error thorwn: ${err}`);

  process.exit(1);
});
