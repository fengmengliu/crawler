import fs from 'fs';
import path from 'path';
import {Router, Request, Response, NextFunction } from 'express';
import Crawller from './util/Crawller';
import MyAnalyzer from './util/MyAnalyzer';
import getResponseData from './util/util';

// 问题1： express库的类型定义文件， .d.ts文件类型描述不准确
// --- 解决方案：引入之前.d.ts文件中的内容，对内容进行修改，即继承原来的内容，再添加自己需要的内容
// 问题2：当使用中间件时，对req或res做了修改之后，实际上类型不能改变，所以获取不到值；
// 比如使用中间件，给对象添加了个属性后，但是受原来.d.ts文件的影响不能生效，因此可以通过ts的类型融合机制，再定义个.d.ts文件（名字随意，扩展名一样就行），使用declare namespace的方式定义原来的变量；ts会对相同类的相同属性进行融合

interface RequestBody extends Request{
  body: {
    [key: string]: string | undefined
  }
}

const checkLogin = (req: RequestBody, res: Response, next: NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if(isLogin){
    next();
  }else{
    res.json(getResponseData(false, `请先登录`));
  }
}

const router = Router();

//路由
router.get('/', (req: Request, res: Response) => {
  const isLogin = req.session ? req.session.login : false;
  if(isLogin) {
    res.send(`
    <html>
      <body>
        <a href='/getData'>爬取内容</a>
        <a href='/showData'>展示数据</a>
        <a href='/logout'>确认退出</a>
      </body>
    </html>
  `)
  }else{
    res.send(`
    <html>
      <body>
        <form method='post' action='/login'>
          <input placeholder='请输入密码' name="password">
          <button>提交</button>
        </form>
      </body>
    </html>
  `);
  }
});

//注意，请求方式不对，比如是get使用成post也会报404错误；
router.get('/getData', checkLogin, (req: RequestBody, res: Response) => {
  const secret = 'x3b174jsx';
  const url = `http://www.dell-lee.com/?secret=${secret}`;
  const crawller = new Crawller(url, MyAnalyzer.getInstance());
  res.json(getResponseData(true));
});

router.post('/login', (req: RequestBody, res: Response) => {
  const { password } = req.body; //没有使用body-parser中间件时，获取不到body中数据
  const isLogin = req.session ? req.session.login : false;
  if(isLogin){
    res.json(getResponseData(false, '您已登录过'));
  }else{
    console.log(req.session);
    if(password === '123' && req.session){
      req.session.login = true;
      res.json(getResponseData(true));
    }else{
      res.json(getResponseData(false, '请输入正确的密码'));
    }
  }
});

router.get('/showData', checkLogin, (req: RequestBody, res: Response) => {
  try{
    const filePath = path.resolve(__dirname, '../data/course.json')
    const content = fs.readFileSync(filePath, 'utf-8');
    res.json(getResponseData(JSON.parse(content)));
  }catch(e){
    res.json(getResponseData(false, '暂无爬取数据'));
  }
});

router.get('/logout', (req: RequestBody, res: Response) => {
  req.session && (req.session.login = undefined);
  res.json(getResponseData(true));
})

export default router;