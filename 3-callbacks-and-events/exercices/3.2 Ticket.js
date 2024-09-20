import { EventEmitter } from "node:events";

function ticket(limitTime, tickOffSet, cb) {
  const event = new EventEmitter();

  const tickInterationMiliseconds = tickOffSet;
  let eventsEmited = 0;
  for (let i = 0; limitTime > i; i += tickInterationMiliseconds) {
    setTimeout(() => {
      if (Date.now() % 500 == 0) {
        event.emit("error", Date.now());
        cb(new Error("Error on tick"));
      } else {
        event.emit("tick", tickInterationMiliseconds + i);
        eventsEmited++;
      }
    }, tickInterationMiliseconds + i);
  }
  setTimeout(() => cb(null, eventsEmited), limitTime);

  return event;
}

ticket(5000, 500, (err, data) => {
  if (err) console.log(`Error: ${err}`);
  else console.log(`Events emited ${data}`);
})
  .on("tick", (miliseconds) => console.log(`Tick made on ${miliseconds}`))
  .on("error", (err) => console.log(`Error event: ${err}`));
