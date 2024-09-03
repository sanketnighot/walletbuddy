module.exports = {
  apps: [
    {
      name: "bot",
      cwd: "./apps/bot",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    },
    {
      name: "web",
      cwd: "./apps/web",
      script: "npm",
      args: "start",
      env: {
        NODE_ENV: "production",
      },
    }
  ],
}