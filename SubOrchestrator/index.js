const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function* (context) {
  
    const input = context.df.getInput();
    const activityTask = context.df.callActivity("Hello", input);

    const deadline = moment.utc(context.df.currentUtcDateTime).add(60, "s");
    const timeoutTask = context.df.createTimer(deadline.toDate());

    const winner = yield context.df.Task.any([activityTask, timeoutTask]);
    return winner;

});