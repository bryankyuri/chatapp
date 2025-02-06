const path = require('path');

module.exports = {
  apps: [
    {
      name: "llm-elevate-local",
      script: path.join("..", "server", "server.js"), // Works on both Windows & Linux
      cwd: __dirname, // Current directory of the config file
      instances: 1, // Single instance for local development
      exec_mode: "fork", // Fork mode is better for Windows
      env: {
        NODE_ENV: "local",
        PORT: 5173,
        DOMAIN: "localhost"
      },
      watch: true,
      ignore_watch: ["node_modules", "dist", ".git"]
    },
    {
      name: "llm-elevate-dev",
      script: "./server/server.js",
      cwd: "/var/www/dev-llm-elevate",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "development",
        PORT: 5173,
        DOMAIN: "dev-llm-elevate.com"
      }
    },
    {
      name: "llm-elevate-prod",
      script: "./server/server.js",
      cwd: "/var/www/prod-llm-elevate",
      instances: "max",
      exec_mode: "cluster",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
        DOMAIN: "prod-llm.elevate.com"
      }
    }
  ]
};