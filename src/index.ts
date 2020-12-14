import express, {Request, Response, NextFunction} from 'express';
// import router from './router';
import './controller/LoginController';
import './controller/CrawllerController';
import router from './router';
import BodyParser from 'body-parser'; // express的中间件  --- 解决路由中获取不到body的问题；
import cookieSession from 'cookie-session';

const app = express();
// app.use((req: Request, res: Response, next: NextFunction) => {//中间件做一些处理
//   req.author = 'lfm';
//   next();
// });
app.use(BodyParser.urlencoded({extended: false})); //此句要放在路由前面，这样路由在使用的时候可以获取到body中数据
app.use(cookieSession({ // 注意：此处中间件要再app.use(router)之前调用，否则req.session中是没数据的
  name: 'session',
  keys: ['lfm'],
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))
app.use(router);

app.listen(7001, () => { // 监听7001端口，服务启动后回调此函数
  console.log('server is running');
});