const { cwd } = require("node:process");

module.exports = {
  apps: [
    {
      name: "balcom",
      // POIN PENTING: Arahkan ke main.js, bukan app.module.js
      script: "dist/main.js", 
      cwd: "/home/project/backend-bci",
      exec_mode: "cluster",
      instances: "max", // Kamu bisa pakai "max" kalau mau utilisasi semua core CPU
      watch: false, // Saran: set ke false di production agar tidak restart sembarangan
      env_file: "/home/project/backend-bci/.env.production",
      env: {
        NODE_ENV: "production"
      }
    }
  ]
}