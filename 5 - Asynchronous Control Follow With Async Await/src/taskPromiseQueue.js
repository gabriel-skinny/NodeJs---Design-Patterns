export class TaskPromiseQueue {
  constructor(concurrency) {
    this.concurrency = concurrency || 2;
    this.promise = Promise.resolve();
    this.promiseToExecute = [];

    this.running = 0;
  }

  pushTask(task) {
    return new Promise((resolve, reject) => {
      console.log("\n---TASK PROMISE PUSH TASK FUNC---");
      this.promiseToExecute.push(() => {
        return task().then(resolve, reject);
      });

      process.nextTick(this.run.bind(this));
    });
  }

  run() {
    console.log("\n---RUNNING LAST TASK ---");

    if (!this.promiseToExecute.length) return;

    while (this.running < this.concurrency) {
      const task = this.promiseToExecute.shift();

      task().then(() => {
        console.log("\n---TASKED RUNNED ---");
        this.running--;
        this.run();
      });

      this.running++;
    }
  }
}
