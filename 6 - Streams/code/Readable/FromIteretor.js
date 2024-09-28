import { Readable } from "stream";

const mountains = [
  {
    name: "K2",
    heigth: 5999,
  },
  {
    name: "everest",
    heigth: 4999,
  },
  { name: "Lhotse", heigth: 8500 },
];

const mountainsStream = Readable.from(mountains, { objectMode: true });
mountainsStream.on("data", (mountain) => {
  console.log(`Name: ${mountain.name} -- heigth: ${mountain.heigth}`);
});
