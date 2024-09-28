import { createServer } from "http";
import Chance from "chance";

function runServer() {
  const chance = new Chance();
  const server = createServer((req, res) => {
    console.log("Server called");
    res.writeHead(200, { "Content-Type": "text/plain" });

    function generateMessage() {
      while (chance.bool({ likelihood: 99 })) {
        const shouldContinue = res.write(`${chance.string()}\n`);

        if (!shouldContinue) {
          console.log("Back pressured");
          res.once("drain", generateMessage);
        }
      }
    }

    generateMessage();
    res.end("\n\n");
    res.on("finish", () => console.log("All data sent"));
  });

  server.listen(3000, () => {
    console.log("Listening on port 3000");
  });
}

runServer();
