// 安装插件
cnpm i 或 npm i 或者 yarn add
// 安装link
sudo npm link
//  然后就能使用命令行工具了
one start
// 或者
yarn run serve
```

- 启动效果
```
启动项目
yarn run v1.3.2
$ pm2 restart ./server/index.js && vue-cli-service serve
Use --update-env to update environment variables
[PM2] Applying action restartProcessId on app [./server/index.js](ids: 0,1)
[PM2] [index](0) ✓
[PM2] [one-sys](1) ✓
┌──────────┬────┬─────────┬─────────┬───────┬────────┬─────────┬────────┬─────┬───────────┬───────────┬──────────┐
│ App name │ id │ version │ mode    │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user      │ watching │
├──────────┼────┼─────────┼─────────┼───────┼────────┼─────────┼────────┼─────┼───────────┼───────────┼──────────┤
│ index    │ 0  │ 0.1.0   │ fork    │ 77439 │ online │ 2640    │ 0s     │ 0%  │ 15.4 MB   │ koala_cpx │ disabled │
│ server   │ 1  │ 0.1.0   │ cluster │ 77438 │ online │ 15      │ 0s     │ 0%  │ 20.2 MB   │ koala_cpx │ disabled │
└──────────┴────┴─────────┴─────────┴───────┴────────┴─────────┴────────┴─────┴───────────┴───────────┴──────────┘
 Use `pm2 show <id|name>` to get more details about an app
 INFO  Starting development server...
 98% after emitting CopyPlugin DONE  Compiled successfully in 10294ms16:31:55


  App running at:
  - Local:   http://localhost:8080/
  - Network: http://192.168.7.69:8080/

  Note that the development build is not optimized.
  To create a production build, run yarn build.
```