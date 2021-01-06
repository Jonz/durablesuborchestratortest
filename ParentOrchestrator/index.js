const df = require("durable-functions");
const moment = require("moment");

module.exports = df.orchestrator(function*(context) {
    let response = {}
    const deadline = moment.utc(context.df.currentUtcDateTime).add(5, "s");
    const timeoutTask = context.df.createTimer(deadline.toDate());

    const activityTask = context.df.callSubOrchestrator("SubOrchestrator", "World");
    
    const winner = yield context.df.Task.any([activityTask, timeoutTask]);
    if (winner === activityTask) {
        // success case
        timeoutTask.cancel();
        response.success = true;
        response.value = activityTask.result;
    }
    else
    {
        // timeout case
        response.success = false;
    }

    return response;
});