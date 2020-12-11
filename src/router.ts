import {Router, Request, Response } from 'express';
import Crawller from './Crawller';
import MyAnalyzer from './MyAnalyzer';

// 问题1： express库的类型定义文件， .d.ts文件类型描述不准确
// --- 解决方案：引入之前.d.ts文件中的内容，对内容进行修改，即继承原来的内容，再添加自己需要的内容
// 问题2：当使用中间件时，对req或res做了修改之后，实际上类型不能改变，所以获取不到值；
// 比如使用中间件，给对象添加了个属性后，但是受原来.d.ts文件的影响不能生效，因此可以通过ts的类型融合机制，再定义个.d.ts文件（名字随意，扩展名一样就行），使用declare namespace的方式定义原来的变量；ts会对相同类的相同属性进行融合

interface RequestBody extends Request{
  body: {
    [key: string]: string | undefined
  }
}

const router = Router();

//路由
router.get('/', (req: Request, res: Response) => {
  let html = `
    <html>
      <body>
        <form method='post' action='/getData'>
          <input placeholder='请输入密码' name="password">
          <button>提交</button>
        </form>
      </body>
    </html>
  `
  res.send(html);
});

router.post('/getData', (req: RequestBody, res: Response) => {
  const { password } = req.body; //没有使用body-parser中间件时，获取不到body中数据
  if(password === '123'){
    const secret = 'x3b174jsx';
    const url = `http://www.dell-lee.com/?secret=${secret}`;
    const crawller = new Crawller(url, MyAnalyzer.getInstance());
    res.send('get data success!');
  } else {
    res.send(`${req.author}密码错误，请从新输入!`);
  }
});

export default router;