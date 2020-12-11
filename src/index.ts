import express, {Request, Response, NextFunction} from 'express';
import router from './router';
import BodyParser from 'body-parser'; // express的中间件  --- 解决路由中获取不到body的问题；

const app = express();
app.use((req: Request, res: Response, next: NextFunction) => {
  req.author = 'lfm';
  next();
});
app.use(BodyParser.urlencoded({extended: false})); //此句要放在路由前面，这样路由在使用的时候可以获取到body中数据
app.use(router);

app.listen(7001, () => { // 监听7001端口，服务启动后回调此函数
  console.log('server is running');
});