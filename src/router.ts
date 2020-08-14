import { Router, Request, Response } from 'express';
import TestAnalyzer from './testAnalyzer';
import { Crawler } from './crawler';

// 上文出现的.d.ts文件不准确解决方法（去修改.d.ts文件目前还是不靠谱的），定义新的接口继承别人的类进行修改即可
interface RequestWithBody extends Request{
  body: {
    [propName: string]: string | undefined
  }
}

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.send(`
    <html>
      <body>
        <form method="post" action="/getData">
          <input type="password" name="password"/>
          <button>提交</button>
        </form>
      </body>
    </html>`);
})

// 采用权限校验来避免恶意获取文件
router.post('/getData', (req: RequestWithBody, res: Response) => {
  const { password } = req.body;
  if(password === '123') {
    const secret= 'x3b174jsx';
    const url = `http://www.dell-lee.com/typescript/demo.html + ${secret}`;
    const analyzer = TestAnalyzer.getInstance();
    new Crawler(analyzer, url);
    res.send('getData is success!');
  } else {
    // 定义类新的类型文件，进行了类型融合，所以此处通过中间件传递的属性，是可以在此处获取到的
    res.send(`${req.teacherName}： password error!`);
  }
})

export default router;