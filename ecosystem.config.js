env_file: "/home/project/backend-bci/.env.production",
    module.exports = {
        apps: [
            {
                name: "balcom",
                script: "./dist/app.module.js",
                exec_mode: "cluster",
                instances: 2,
                watch: ["dist"],
                env_file: "/home/project/backend-bci/.env.production",
                env: {
                    NODE_ENV: "production"
                },
                env_production: {
                    NODE_ENV: "production"
                }
            }
        ]
    }


