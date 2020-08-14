# crawler
test for crawler in typescript

（1）开发过程中可以使用ts-node来事实进行ts文件的编译运行："dev": "ts-node ./src/crawler",但是看不见编译后的源代码，所以采用： tsc -w 来进行动态监听和执行

（2）引入nodemon工具(npm i nodemon -D)，来监听js文件的变化： "start": "nodemon node ./dist/crawler.js" （监视到js变化后，会用node执行crawler.js文件）

（3）结合上面两条语句，可以实现当ts文件变化的时候，自动编译成js文件，同时nodemon监视到js变化，自动执行node命令后的js文件;两条语句可以用一个语句来调用（解决了用两个命令行工具）：
先安装concurrently: npm i concurrently -D

（4）最终执行命令如下：
  "dev:build": "tsc -w",
  "dev:start": "nodemon node ./dist/crawler.js",
  "start": "concurrently npm:dev:*"
  其中，最后一句，是用concurrently执行npm run dev后面的所有命令的简写。