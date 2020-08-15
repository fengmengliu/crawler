import fs from 'fs';
import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import Analyzer from './util/testAnalyzer';
import { Crawler } from './util/crawler';
import { getResponseData } from './util/util'; 

// 上文出现的.d.ts文件不准确解决方法（去修改.d.ts文件目前还是不靠谱的），定义新的接口继承别人的类进行修改即可
interface RequestBody extends Request{
  body: {
    [propName: string]: string | undefined
  }
}

// 业务逻辑中间件
const checkLogin = (req: Request, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : undefined;
  if(isLogin) {
    next();
  } else {
    res.json(getResponseData(null, '请先登录！'));
  }
}

const router = Router();

// 首页接口
router.get('/', (req: RequestBody, res: Response) => {
  const isLogin = req.session ? req.session.login : undefined;
  if(isLogin) {
    res.send(`
      <html>
        <body>
          <a href="/getData">爬取内容</a>
          <a href="/showData">展示内容</a>
          <a href="/logout">退出</a>
        </body>
      </html>`);
  } else {
    res.send(`
      <html>
        <body>
          <form method="post" action="/login">
            <input type="password" name="password"/>
            <button>提交</button>
          </form>
        </body>
      </html>`);
  }
})

// 登录操作
router.post('/login', (req: RequestBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : undefined;
  if(isLogin) {
    res.json(getResponseData(false, '已经登录过'));
  } else {
    if(password === '123' && req.session) {
        req.session.login = true;
        res.json(getResponseData(true));
    } else {
      res.json(getResponseData(false, '登录失败'));
    }
  }
})

// 登出操作
router.get('/logout', (req: RequestBody, res: Response) => {
  if(req.session) {
    req.session.login = undefined;
  }
  res.json(getResponseData(true));
})

// 爬取数据
router.get('/getData', checkLogin, (req: RequestBody, res: Response) => {
  const secret= 'x3b174jsx';
  const url = `http://www.dell-lee.com/typescript/demo.html + ${secret}`;
  const analyzer = Analyzer.getInstance();
  new Crawler(analyzer, url);
  res.json(getResponseData(true));
})

// 从文件中读取爬取到的内容信息
router.get('/showData', checkLogin, (req: RequestBody, res: Response) =>{
  try {
    const filePath = path.resolve(__dirname, '../data/content.json'); // 此路径为源码的相对路路径，而不是打包编译后的编译文件的路径
    const result = fs.readFileSync(filePath, 'utf-8');
    res.json(getResponseData(JSON.parse(result)));
  } catch (error) {
    res.json(getResponseData(false, '数据不存在'));
  }
});

export default router;