import { Readable } from "stream";
import Chance from "chance";

const chance = new Chance();

export class RandomStream extends Readable {
  constructor(options) {
    super(options);
    this.emittedBytes = 0;
  }

  _read(size) {
    const chunk = chance.string({ length: size });
    this.push(chunk, "utf-8");
    this.emittedBytes += chunk.length;
    if (chance.bool({ likelihood: 5 })) {
      this.push(null);
    }
  }
}

const randomStream = new RandomStream();

randomStream
  .on("data", (chunk) => {
    console.log(`Chunck received (${chunk.length} bytes): ${chunk.toString()}`);
  })
  .on("end", () => {
    console.log("\n---ENDED RANDOM STREAM ---");
    console.log(`Produced ${randomStream.emittedBytes} bytes of random data`);
  });
