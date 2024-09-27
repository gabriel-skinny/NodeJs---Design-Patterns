const taskQueue = [];

const produce = (task) => {
  taskQueue.push(task);
};

const consumerStart = () => {
  while (true) {
    if (taskQueue.length == 0) {
      process.nextTick(() => console.log("Slepping..."));
      continue;
    }

    const task = taskQueue.shift();

    console.log("TASK CONSUMED");
  }
};

consumerStart();
produce("12");
