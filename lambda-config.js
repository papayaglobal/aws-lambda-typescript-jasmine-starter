module.exports = {
    region: 'us-west-1',
    handler: 'index.handler',
    role: "<my-arn>",
    functionName: "my-function-name",
    timeout: 10,
    memorySize: 128,
    runtime: 'nodejs6.10'
  }
