

#####技术栈选择
- 前端整合：vue-cli3.0、axios、element等
- 命令行工具整合：commander、chalk、figlet、shelljs等 
- 后端整合：node、 koa2、koa-mysql-session、mysql等
- 服务器整合：nginx、pm2、node等

#####基本功能模块实现
- 聚合分离
所谓聚合分离，首先是‘聚合’，聚合代码，聚合插件，做到一个项目就可完成前端端代码的编写，打包上线等功能的聚合。其后是‘分离’。前后端分离。虽然代码会在同一个项目工程中但是前后端互不干扰，分别上线，区别于常规的ejs等服务端渲染的模式，做到前端完全分离
- 一键部署
基于本地的命令行工具，可以快速打包view端的静态文件并上传到阿里云服务器，也可快速上传server端的文件到服务器文件夹，配合pm2的监控功能进行代码的热更新，无缝更新接口逻辑
- 快速迭代
提供基本的使用案例，包括前端的view层的容器案例与组件案例，组件的api设定以及集合了axios的中间件逻辑，方便用户快速搭建自己的项目，代码清晰，易于分析与修改，server端对mysql连接池进行简单的封装，完成连接后及时释放，对table表格与函数进行分层，代码分层为路由层、控制器层、sql操作层

#####基本模块举例
1.登录页面 
- 登录 -正确反馈 错误反馈 登录成功后session的设定
- 注册 -重名检测 正确反馈 错误反馈
2. 主要模块功能
- 模块增删查改基本功能的实现
3. 后台koa2服务模块
- 配合koa-mysql-session进行session的设定储存
- checkLogin中间件的实现
- cors跨域白名单的设定
- middlewer 中间件的设定
- mysql连接池的封装
等等。。。
4. 服务端
- nginx 的基本配置与前端端分离的配置
- pm2 多实例构建配置文件的配置文件 pm2config.json

#####使用流程
1. 本地调试
- 安装mysql （过程请百度）
```
// 进入sql命令行
$ mysql -u root -p
// 创建名为nodesql的数据库
$ create database nodesql
```
- 安装pm2 (过程请百度)
```
// 安装插件
cnpm i 或 npm i 或者 yarn add
// 安装link
sudo npm link
//  然后就能使用命令行工具了
one start
// 或者不愿意使用命令行的同学可以
yarn run serve
```

#####主要代码解析
- 启动项目
```
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
│ one-sys  │ 1  │ 0.1.0   │ cluster │ 77438 │ online │ 15      │ 0s     │ 0%  │ 20.2 MB   │ koala_cpx │ disabled │
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

2. 线上调试
- 阿里云服务器文件存放目录
```
[root@iZm5e6naugml8q0362d8rfZ ~]# cd /home/
[root@iZm5e6naugml8q0362d8rfZ home]# ls
dist  server  test
[root@iZm5e6naugml8q0362d8rfZ home]#
```
- 阿里云nginx配置
```
       location ^~ /api {
          proxy_pass http://127.0.0.1:3000;
        }

        location ^~ /redAlert/ {
           root /home/dist/;
           try_files $uri $uri/ /index.html =404;
        }

        location ^~ /file/ {
            alias /home/server/controller/public/;
        }

        location / {
            root   /home/dist/;
            index  index.html index.htm;
        }
```
