import { Router, Request, Response } from 'express';
import TestAnalyzer from './testAnalyzer';
import { Crawler } from './crawler';
import fs from 'fs';
import path from 'path';

// 上文出现的.d.ts文件不准确解决方法（去修改.d.ts文件目前还是不靠谱的），定义新的接口继承别人的类进行修改即可
interface RequestWithBody extends Request{
  body: {
    [propName: string]: string | undefined
  }
}

const router = Router();

// 首页接口
router.get('/', (req: Request, res: Response) => {
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
router.post('/login', (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  const isLogin = req.session ? req.session.login : undefined;
  if(isLogin) {
    res.send('已经登录过');
  } else {
    if(password === '123' && req.session) {
        req.session.login = true;
        res.send('登录成功');
    } else {
      res.send('登录失败');
    }
  }
})

// 登出操作
router.post('/logout', (req: RequestWithBody, res: Response) => {
  if(req.session) {
    req.session.login = undefined;
  }
  res.redirect('/'); // 跳转到首页
})

// 爬取数据
router.get('/getData', (req: RequestWithBody, res: Response) => {
  const isLogin = req.session ? req.session.login : undefined;
  if(isLogin) {
    const secret= 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html + ${secret}`;
    const analyzer = TestAnalyzer.getInstance();
    new Crawler(analyzer, url);
    res.send('getData is success!');
  } else {
    res.send('请登录后爬取内容!');
  }
})

// 从文件中读取爬取到的内容信息
router.get('/showData', (req: RequestWithBody, res: Response) =>{
  const isLogin = req.session ? req.session.login : undefined;
  if(isLogin) {
    try {
      const filePath = path.resolve(__dirname, '../data/content.json');// 注意：此处打包后的路径是相对于build目录来找data目录的
      const result = fs.readFileSync(filePath, 'utf-8');
      res.json(JSON.parse(result));
    } catch (error) {
      res.send('尚未爬取到内容');
    }
  } else {
    res.send('请登录后查看');
  }
});

export default router;