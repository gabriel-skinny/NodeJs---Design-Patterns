class TaskQueue {
  constructor(concurrency) {
    this.concurrency = concurrency;
    this.taskQueue = [];
    this.resolveTimeout = undefined;
    this.resolveConsumerQueue = [];

    this.spawnConsumers();
  }

  async spawnConsumers() {
    for (let i = 0; i < this.concurrency; i++) {
      this.consumer(i);
    }
  }

  async consumer(id) {
    console.log(`\n---CONSUMER ${id} START---`);
    while (true) {
      try {
        const task = await this.getTask();

        const taskResult = await task();

        console.log({ taskResult, consumerId: id });
      } catch (error) {
        console.error(error);
      }
    }
  }

  runTask(task) {
    return new Promise((resolve, reject) => {
      const taskWrapper = () => {
        const taskPromise = task();

        taskPromise.then(resolve, reject);
        return taskPromise;
      };

      if (this.resolveConsumerQueue.length) {
        const resolveConsumer = this.resolveConsumerQueue.shift();
        resolveConsumer(taskWrapper);
      } else {
        this.taskQueue.push(taskWrapper);
      }
    });
  }

  getTask() {
    return new Promise((resolve) => {
      if (this.taskQueue.length !== 0) {
        return resolve(this.taskQueue.shift());
      }

      this.resolveConsumerQueue.push(resolve);
    });
  }
}

const NUMBER_CONSUMERS = 4;
const queue = new TaskQueue(NUMBER_CONSUMERS);

async function runProducer() {
  const taskResult = await queue.runTask(() => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(10);
      }, 1000);
    });
  });

  console.log({ taskResultReturn: taskResult });
}

for (let i = 0; i < 20; i++) runProducer();
