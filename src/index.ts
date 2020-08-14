import express, {Request, Response, NextFunction}  from 'express';
import router from './router';
import bodyParser from 'body-parser';

// 问题1：express库的类型定义文件 .d.ts文件类型描述不准确
// 问题2：当我使用中间件的时候，对 req 或者 res做了修改之后，实际上类型并不能改变（这样的问题是在给中间件传递的东西，在路由里是获取不到的，这就是使用老的express框架存在的问题）

const app = express();

app.use(bodyParser.urlencoded({ extended: false })); // 此处要先引入此中间件(即：先解析请求的内容，再进行路由跳转)，再使用router
// 自定义插件： 插件就是一个函数，接收三个参数
app.use((req: Request, res: Response, next: NextFunction) => {
  req.teacherName = 'lfm';
  next();
});

app.use(router);

app.listen(7001, () => {
  console.log('server is running');
})