import { Request, Response } from 'express';
import 'reflect-metadata';
import { controller, get } from './Decorator';

interface RequestBody extends Request{
  body: {
    [propName: string]: string | undefined
  }
}

// 逻辑的融合放在类装饰器上
@controller
class LoginController{
  @get('/login')
  login() {

  }
  @get('/')
  home(req: RequestBody, res: Response) {
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
  }
}