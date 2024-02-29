module.exports = {
  apps : [{
    name : 'balcom',
    script: "./dist/main.js",
    instances : "max",
    exec_mode : "cluster",
    watch: ["dist"],
    ignore_watch : ["node_modules"],
    watch_options: {
      "followSymlinks": false
    },
    env_production: {
      NODE_ENV: "production"
   },
   env_development: {
      NODE_ENV: "development"
   }
  }, {
    script: './service-worker/',
    watch: ['./service-worker']
  },
  

],

  
};
