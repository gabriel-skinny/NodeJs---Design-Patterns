import { EventEmitter } from "node:events";

export default class TaskQueue extends EventEmitter {
  constructor(concurrency) {
    super();
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  pushTask(task) {
    this.queue.push(task);
    process.nextTick(this.next.bind(this));

    return this;
  }

  next() {
    if (this.running == 0 && this.queue.length === 0) {
      return this.emit("empty");
    }

    while (this.running < this.concurrency && this.queue.length) {
      const task = this.queue.shift();

      task((err, urlsDownloaded, totalSpideredUrls) => {
        if (err) {
          this.emit("error", `Error on task: ${err}`);
        }

        this.running--;

        if (this.running == 0 && this.queue.length === 0) {
          this.emit("result", urlsDownloaded, totalSpideredUrls);
        }

        process.nextTick(this.next.bind(this));
      });

      this.running++;
      console.log("\nTASK RUNNING---");
      console.log({ running: this.running });
    }
  }
}
