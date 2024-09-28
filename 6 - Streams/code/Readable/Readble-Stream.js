// Non-Flowing, data being pushed by the read method
process.stdin
  .on("readable", () => {
    let chunk;
    console.log("New data available Non-Flowing Mode");
    while ((chunk = process.stdin.read()) !== null) {
      console.log(
        `Chunk read by Non-Flowing Mode (${
          chunk.length
        } bytes): "${chunk.toString()}"`
      );
    }
  })
  .on("end", () => console.log("End of String"));

// Flowing
process.stdin
  .on("data", (chunk) => {
    console.log("New data available Flowing Mode");
    console.log(
      `Chunk read by Flowing Mode (${
        chunk.length
      } bytes): "${chunk.toString()}"`
    );
  })
  .on("end", () => console.log("End of String"));

// Async iteretors
async function main() {
  for await (const chunk of process.stdin) {
    console.log("New data available Iteretor");
    console.log(
      `Chunk read by Iteretor (${chunk.length} bytes): "${chunk.toString()}"`
    );
  }

  console.log("End of Stream");
}

main();
