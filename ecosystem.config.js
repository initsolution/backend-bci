const { cwd } = require("node:process");

module.exports = {
  apps: [
    {
      name: "balcom",
      script: "dist/main.js", 
      cwd: "/home/project/backend-bci",
      exec_mode: "cluster",
      instances: "max", 
      watch: false, 
      out_file: "/dev/null",
      error_file: "/dev/null",
      env_file: "/home/project/backend-bci/.env.production",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}